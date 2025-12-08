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
  private readonly CACHE_KEY = 'admin:dashboard';

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
    // If role enforcement needed later:
    // const role = (user.publicMetadata as any)?.role;
    // if (role !== 'admin') {
    //   throw new ForbiddenException('Only admins can access this dashboard');
    // }
  }

  async getGlobalDashboard(user: User) {
    this.ensureIsAdmin(user);

    const cached = await this.cache.get(this.CACHE_KEY);
    if (cached) {
      this.logger.debug(`CACHE HIT: ${this.CACHE_KEY}`);
      return cached;
    }

    this.logger.debug(`CACHE MISS: ${this.CACHE_KEY}`);

    // ---- 1. Fetch Clerk users ----
    const users = await this.clerkClient.users.getUserList();
    const userList = users.data;

    // ---- 2. Fetch subscriptions grouped ----
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
        String(item.normalizedId).trim().toLowerCase(),
        {
          subscriptionCount: Number(item.subscriptionCount),
          notifications: Number(item.notifications),
        },
      ]),
    );

    this.logger.debug(
      `SubscriptionMap Keys: ${JSON.stringify([...subscriptionMap.keys()])}`,
    );

    // ---- 3. Combine Clerk user + DB stats ----
    const mergedUsers = userList.map((u) => {
      const normalizedKey = String(u.id).trim().toLowerCase();
      const subStats = subscriptionMap.get(normalizedKey) || {
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

    // ---- 4. Metrics ----
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

    const response = {
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

    await this.cache.set(this.CACHE_KEY, response, 30 * 1000);

    return response;
  }
}
