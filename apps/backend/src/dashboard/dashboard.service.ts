import { type ClerkClient, User } from '@clerk/backend';
import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
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

  private ensureIsAdmin(user: User) {
    // Uncomment later if needed
    // const role = (user.publicMetadata as any)?.role;
    // if (role !== 'admin') throw new ForbiddenException("Not allowed");
  }

  private buildCacheKey(user: User) {
    const env = process.env.NODE_ENV || 'dev';

    return `dashboard:${env}:admin:${user.id}`;
  }

  async getGlobalDashboard(user: User) {
    this.ensureIsAdmin(user);

    const cacheKey = this.buildCacheKey(user);

    // ---- 1. Read from cache first
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      this.logger.debug(`CACHE HIT → ${cacheKey}`);
      return cached;
    }

    this.logger.debug(`CACHE MISS → ${cacheKey}`);

    // ---- 2. Fetch Clerk users
    const users = await this.clerkClient.users.getUserList();
    const userList = users.data;

    // ---- 3. Fetch subscription stats with correct alias
    const subscriptions = await this.subscriptionRepository
      .createQueryBuilder('s')
      .select([
        `LOWER(TRIM(s."clerkUserId")) AS "normalizedId"`,
        `COUNT(*)::int AS "subscriptionCount"`,
        `SUM(CASE WHEN s.notifications = true THEN 1 ELSE 0 END)::int AS "notifications"`,
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

    // ---- 4. Merge Clerk users with DB subscription counts
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

    // ---- 5. Metrics logic
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
      this.subscriptionRepository.count({ where: { notifications: true } }),
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

    // ---- 6. Store in cache for 30 sec
    await this.cache.set(cacheKey, result, 30_000);

    return result;
  }
}
