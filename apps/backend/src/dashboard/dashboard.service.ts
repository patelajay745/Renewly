import { type ClerkClient, User } from '@clerk/backend';
import { InjectQueue } from '@nestjs/bullmq';
import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import {
  Subscription,
  SubscriptionType,
} from 'src/subscriptions/entities/subscription.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,

    @InjectQueue('notifications')
    private readonly notificationQueue: Queue,

    @Inject('ClerkClient')
    private readonly clerkClient: ClerkClient,

    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  async getGlobalDashboard(user: User) {
    const isAdmin = await user.publicMetadata?.role;

    if (!isAdmin) {
      throw new ForbiddenException('Only admin can access this route');
    }

    const cacheKey = `dashboard:admin:${user.id}`;

    const cached = await this.cache.get(cacheKey);
    if (cached) {
      this.logger.debug(`CACHE HIT → ${cacheKey}`);
      return cached;
    }

    this.logger.debug(`CACHE MISS → ${cacheKey}`);

    const users = await this.clerkClient.users.getUserList();
    const userList = users.data;

    const subscriptions = await this.subscriptionRepository
      .createQueryBuilder('s')
      .select([
        `LOWER(TRIM(s."clerkUserId")) AS "normalizedId"`,
        `COUNT(*)::int AS "subscriptionCount"`,
        `SUM(CASE WHEN s.notification = true THEN 1 ELSE 0 END)::int AS "notifications"`,
      ])
      .groupBy(`s."clerkUserId"`)
      .getRawMany();

    const subscriptionMap = new Map(
      subscriptions.map((item) => [
        String(item.normalizedId).toLowerCase(),
        {
          subscriptionCount: Number(item.subscriptionCount),
          notifications: Number(item.notifications),
        },
      ]),
    );

    const mergedUsers = userList.map((u) => {
      const lookupKey = String(u.id).toLowerCase();
      const subStats = subscriptionMap.get(lookupKey) || {
        subscriptionCount: 0,
        notifications: 0,
      };

      return {
        id: u.id,
        name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || null,
        email: u?.emailAddresses?.[0]?.emailAddress || null,
        image: u.imageUrl,
        createdAt: u.createdAt,
        lastActiveAt: u.lastActiveAt,
        subscriptionCount: subStats.subscriptionCount,
        enabledNotifications: subStats.notifications,
      };
    });

    const [
      totalSubscriptions,
      distinctUsersRaw,
      notificationsEnabled,
      expoTokensRegistered,
      monthly,
      weekly,
      yearly,
      waiting,
      active,
      delayed,
      completed,
      failed,
    ] = await Promise.all([
      this.subscriptionRepository.count(),
      this.subscriptionRepository
        .createQueryBuilder('s')
        .select('COUNT(DISTINCT s.clerkUserId)', 'count')
        .getRawOne(),
      this.subscriptionRepository.count({ where: { notification: true } }),
      this.subscriptionRepository
        .createQueryBuilder('s')
        .where('s.expoToken IS NOT NULL')
        .getCount(),
      this.subscriptionRepository.count({
        where: { type: SubscriptionType.MONTHLY },
      }),
      this.subscriptionRepository.count({
        where: { type: SubscriptionType.WEEKLY },
      }),
      this.subscriptionRepository.count({
        where: { type: SubscriptionType.YEARLY },
      }),
      this.notificationQueue.getWaitingCount(),
      this.notificationQueue.getActiveCount(),
      this.notificationQueue.getDelayedCount(),
      this.notificationQueue.getCompletedCount(),
      this.notificationQueue.getFailedCount(),
    ]);

    const result = {
      stats: {
        totalSubscriptions,
        totalUsersWithSubscriptions: Number(distinctUsersRaw?.count ?? 0),
        subscriptionsByType: { monthly, weekly, yearly },
        notifications: {
          subscriptionsWithNotificationsEnabled: notificationsEnabled,
          subscriptionsWithExpoToken: expoTokensRegistered,
        },
      },
      queue: { waiting, active, delayed, completed, failed },
      users: mergedUsers.sort(
        (a, b) => b.subscriptionCount - a.subscriptionCount,
      ),
    };

    await this.cache.set(cacheKey, result, 15 * 60 * 1000);

    return result;
  }

  private calculateNextRenewalDate(s: Subscription) {
    const startDate = new Date(s.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let nextRenewal = new Date(startDate);

    if (s.type === 'weekly')
      while (nextRenewal <= today)
        nextRenewal.setDate(nextRenewal.getDate() + 7);

    if (s.type === 'monthly')
      while (nextRenewal <= today)
        nextRenewal.setMonth(nextRenewal.getMonth() + 1);

    if (s.type === 'yearly')
      while (nextRenewal <= today)
        nextRenewal.setFullYear(nextRenewal.getFullYear() + 1);

    return nextRenewal;
  }

  async getUserDashboard(user: User) {
    const cacheKey = `dashboard:user:${user.id}`;

    const cached = await this.cache.get(cacheKey);
    if (cached) {
      this.logger.debug(`USER CACHE HIT → ${cacheKey}`);
      return cached;
    }

    this.logger.debug(`USER CACHE MISS → ${cacheKey}`);

    const subscriptions = await this.subscriptionRepository.find({
      where: { clerkUserId: user.id },
      order: { createdAt: 'DESC' },
    });

    const totalSubscriptions = subscriptions.length;

    const totalWeeklySpend = subscriptions
      .filter((s) => s.type === SubscriptionType.WEEKLY)
      .reduce((sum, s) => sum + s.amount, 0);

    const totalMonthlySpend = subscriptions
      .filter((s) => s.type === SubscriptionType.MONTHLY)
      .reduce((sum, s) => sum + s.amount, 0);

    const totalYearlySpend = subscriptions
      .filter((s) => s.type === SubscriptionType.YEARLY)
      .reduce((sum, s) => sum + s.amount, 0);

    const notificationsEnabledCount = subscriptions.filter(
      (s) => s.notification === true,
    ).length;
    const expoTokenRegistered = subscriptions.some((s) => s.expoToken);

    const nextPayments = subscriptions
      .map((s) => ({
        id: s.id,
        title: s.title,
        amount: s.amount,
        type: s.type,
        nextPayment: this.calculateNextRenewalDate(s),
      }))
      .sort((a, b) => a.nextPayment.getTime() - b.nextPayment.getTime())
      .slice(0, 5);

    const result = {
      stats: {
        totalSubscriptions,
        totalWeeklySpend,
        totalMonthlySpend,
        totalYearlySpend,
        totalYearlyProjection:
          totalWeeklySpend * 52 + totalMonthlySpend * 12 + totalYearlySpend,
        notificationsEnabledCount,
        expoTokenRegistered,
      },
      nextPayments,
      recentSubscriptions: subscriptions.slice(0, 5),
    };

    await this.cache.set(cacheKey, result, 15 * 60 * 1000);

    return result;
  }
}
