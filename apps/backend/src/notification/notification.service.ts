import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { NotificationJobData } from './notification.processor';

@Injectable()
export class NotificationService {

    private readonly logger = new Logger(NotificationService.name)

    constructor(
        @InjectRepository(Subscription)
        private subscriptionRepository: Repository<Subscription>,
        @InjectQueue('notifications')
        private notificationQueue: Queue<NotificationJobData>
    ) { }

    @Cron(CronExpression.EVERY_MINUTE)
    async handleCron() {
        this.logger.log('Running scheduled notification check...');

        // Fetch all subscriptions with notifications enabled
        const subscriptions = await this.subscriptionRepository.find({
            where: {
                notification: true
            }
        });

        const tomorrowDate = new Date();
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        const tomorrowYear = tomorrowDate.getFullYear();
        const tomorrowMonth = tomorrowDate.getMonth();
        const tomorrowDay = tomorrowDate.getDate();

        // Filter subscriptions that are renewing tomorrow
        const renewingTomorrow = subscriptions.filter(subscription => {
            const nextRenewalDate = this.calculateNextRenewalDate(subscription);

            const renewalYear = nextRenewalDate.getUTCFullYear();
            const renewalMonth = nextRenewalDate.getUTCMonth();
            const renewalDay = nextRenewalDate.getUTCDate();

            return renewalYear === tomorrowYear &&
                renewalMonth === tomorrowMonth &&
                renewalDay === tomorrowDay;
        });

        this.logger.log(`Found ${renewingTomorrow.length} subscriptions renewing tomorrow`);

        // Add each notification to the queue
        let enqueuedCount = 0;
        for (const subscription of renewingTomorrow) {
            if (subscription.expoToken) {
                try {
                    await this.notificationQueue.add(
                        'send-renewal-reminder',
                        {
                            expoToken: subscription.expoToken,
                            title: "It's time to renew subscription",
                            subscriptionTitle: subscription.title,
                            subscriptionId: subscription.id,
                        },
                        {
                            // Job options
                            attempts: 3, // Retry up to 3 times
                            backoff: {
                                type: 'exponential',
                                delay: 2000, // Start with 2 seconds, then 4, 8, etc.
                            },
                            removeOnComplete: {
                                age: 3600, // Keep completed jobs for 1 hour
                                count: 1000, // Keep last 1000 completed jobs
                            },
                            removeOnFail: {
                                age: 86400, // Keep failed jobs for 24 hours
                            },
                            // Prevent duplicate notifications for the same subscription today
                            jobId: `renewal-reminder-${subscription.id}-${new Date().toISOString().split('T')[0]}`,
                        }
                    );
                    enqueuedCount++;
                } catch (error) {
                    this.logger.error(
                        `Failed to enqueue notification for subscription ${subscription.id}: ${error.message}`
                    );
                }
            }
        }

        this.logger.log(`Successfully enqueued ${enqueuedCount} notification jobs`);
    }

    private calculateNextRenewalDate(subscription: Subscription): Date {
        const startDate = new Date(subscription.startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let nextRenewal = new Date(startDate);

        switch (subscription.type) {
            case 'weekly':

                while (nextRenewal <= today) {
                    nextRenewal.setDate(nextRenewal.getDate() + 7);
                }
                break;

            case 'monthly':

                while (nextRenewal <= today) {
                    nextRenewal.setMonth(nextRenewal.getMonth() + 1);
                }
                break;

            case 'yearly':

                while (nextRenewal <= today) {
                    nextRenewal.setFullYear(nextRenewal.getFullYear() + 1);
                }
                break;

            default:

                return new Date('2099-12-31');
        }

        return nextRenewal;
    }
}
