import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { BullModule } from '@nestjs/bullmq';
import { ClerkClientProvider } from 'src/providers/clerk-client.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription]),
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  controllers: [DashboardController],
  providers: [ClerkClientProvider, DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
