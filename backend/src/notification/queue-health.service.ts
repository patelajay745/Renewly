import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QueueHealthService implements OnModuleInit {
    private readonly logger = new Logger(QueueHealthService.name);

    constructor(
        @InjectQueue('notifications')
        private notificationQueue: Queue
    ) { }

    async onModuleInit() {
        this.logger.log('Checking BullMQ connection...');

        try {
            const client = await this.notificationQueue.client;
            const isReady = client.status === 'ready';

            if (isReady) {
                this.logger.log('✅ BullMQ connected to Redis successfully');

               
                const waiting = await this.notificationQueue.getWaitingCount();
                const active = await this.notificationQueue.getActiveCount();
                const completed = await this.notificationQueue.getCompletedCount();
                const failed = await this.notificationQueue.getFailedCount();

                this.logger.log(`Queue stats - Waiting: ${waiting}, Active: ${active}, Completed: ${completed}, Failed: ${failed}`);

                
                if (failed > 0) {
                    const failedJobs = await this.notificationQueue.getFailed(0, 5);
                    this.logger.warn(`Found ${failed} failed job(s):`);
                    for (const job of failedJobs) {
                        this.logger.error(`  - Job ${job.id}: ${job.failedReason}`);
                    }
                }

               
                if (waiting > 0) {
                    this.logger.log(`⏳ ${waiting} job(s) waiting to be processed`);
                }
            } else {
                this.logger.error('❌ Redis connection not ready');
            }
        } catch (error) {
            this.logger.error('❌ Failed to connect to Redis:', error.message);
        }
    }
}
