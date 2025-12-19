import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger, OnModuleInit } from '@nestjs/common';
import { Job } from 'bullmq';
import { Expo } from 'expo-server-sdk';

export interface NotificationJobData {
    expoToken: string;
    title: string;
    subscriptionTitle: string;
    subscriptionId: string;
}

@Processor('notifications', {
    concurrency: 5,
})
export class NotificationProcessor extends WorkerHost implements OnModuleInit {
    private readonly logger = new Logger(NotificationProcessor.name);
    private readonly expo: Expo;

    constructor() {
        super();
        this.expo = new Expo();
    }

    onModuleInit() {
        this.logger.log('🚀 NotificationProcessor initialized and ready to process jobs');
        this.logger.log(`Worker listening to queue: notifications`);
    }

    @OnWorkerEvent('active')
    onActive(job: Job) {
        this.logger.log(`🔄 Job ${job.id} is now active`);
    }

    @OnWorkerEvent('completed')
    onCompleted(job: Job) {
        this.logger.log(`✅ Job ${job.id} completed successfully`);
    }

    @OnWorkerEvent('failed')
    onFailed(job: Job, error: Error) {
        this.logger.error(`❌ Job ${job.id} failed with error: ${error.message}`);
    }

    async process(job: Job<NotificationJobData>) {
        const { expoToken, title, subscriptionTitle, subscriptionId } = job.data;

        this.logger.log(
            `Processing notification job ${job.id} for subscription: ${subscriptionTitle} (attempt ${job.attemptsMade + 1})`
        );

        if (!Expo.isExpoPushToken(expoToken)) {
            this.logger.error(`Invalid Expo push token: ${expoToken}`);

            throw new Error('Invalid Expo push token');
        }

        try {
            const notification = {
                to: expoToken,
                sound: 'default' as const,
                title: title,
                body: `Your subscription is due tomorrow for ${subscriptionTitle}`,
                data: {
                    subscriptionId: subscriptionId,
                    type: 'renewal_reminder',
                },
            };

            const chunks = this.expo.chunkPushNotifications([notification]);

            for (const chunk of chunks) {
                const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);

                this.logger.log(
                    `Notification sent successfully for job ${job.id}. Ticket: ${JSON.stringify(ticketChunk)}`
                );

                for (const ticket of ticketChunk) {
                    if (ticket.status === 'error') {
                        this.logger.error(
                            `Expo returned error for job ${job.id}: ${ticket.message}`
                        );

                        if (ticket.details?.error === 'DeviceNotRegistered') {
                            throw new Error('DeviceNotRegistered - will not retry');
                        }

                        throw new Error(`Expo error: ${ticket.message}`);
                    }
                }

                return ticketChunk;
            }
        } catch (error) {
            this.logger.error(
                `Failed to send notification for job ${job.id}: ${error.message}`,
                error.stack
            );

            throw error;
        }
    }
}
