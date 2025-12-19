import {
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { Repository } from 'typeorm';
import { User } from '@clerk/backend';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @Inject(CACHE_MANAGER)
    private cache: Cache,
  ) { }

  async create(user: User, createSubscriptionDto: CreateSubscriptionDto) {
    try {

      const newSubscription = await this.subscriptionRepository.create({
        ...createSubscriptionDto,
        clerkUserId: user.id,
      });

      const saved = await this.subscriptionRepository.save(newSubscription);

      if (!saved) {
        throw new HttpException('Something went wrong', 400);
      }

      await this.clearUserSubscriptionsCache(user.id);

      await this.clearDashboardCache(user.id);

      return saved;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findAll(user: User, query?: any) {
    if (!user) throw new NotFoundException('User not found');

    const cacheKey = this.generateSubscriptionsListKey(user.id, query);

    const cached = await this.cache.get(cacheKey);

    if (cached) {
      this.logger.log(`CACHE HIT: ${cacheKey}`);
      return cached;
    }

    const subscriptions = await this.subscriptionRepository.find({
      where: { clerkUserId: user.id },
      order: { startDate: 'DESC' },
      take: query?.limit || 50,
      skip: query?.page ? (query.page - 1) * (query?.limit || 50) : 0,
    });

    await this.cache.set(cacheKey, subscriptions, 15 * 60 * 1000);

    await this.addCacheKeyToUserTag(user.id, cacheKey);

    this.logger.log(`CACHE SET: ${cacheKey}`);

    return subscriptions;
  }

  async findOne(user: User, id: string) {
    try {
      const cacheKey = `subscriptions:${id}`;

      const cached = await this.cache.get(cacheKey);

      if (cached) {
        this.logger.log(`CACHE HIT: ${cacheKey}`);
        return cached;
      }

      const subscription = await this.subscriptionRepository.findOne({
        where: {
          id,
        },
      });

      if (!subscription) throw new NotFoundException('Subscription not found');

      await this.cache.set(cacheKey, subscription, 60 * 60 * 1000);

      return subscription;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 400);
    }
  }

  async update(
    user: User,
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    try {
      const findforUpdate = await this.subscriptionRepository.findOneBy({
        id,
      });

      if (!findforUpdate) {
        throw new NotFoundException('Subscription not found');
      }

      if (findforUpdate?.clerkUserId !== user.id) {
        throw new ForbiddenException(
          "You can't update other user's subscription",
        );
      }

      if (updateSubscriptionDto.amount !== undefined) {
        findforUpdate.amount = updateSubscriptionDto.amount;
      }

      if (updateSubscriptionDto.category !== undefined) {
        findforUpdate.category = updateSubscriptionDto.category;
      }

      if (updateSubscriptionDto.notification !== undefined) {
        findforUpdate.notification = updateSubscriptionDto.notification;
      }

      if (updateSubscriptionDto.title !== undefined) {
        findforUpdate.title = updateSubscriptionDto.title;
      }

      if (updateSubscriptionDto.type !== undefined) {
        findforUpdate.type = updateSubscriptionDto.type;
      }

      if (updateSubscriptionDto.expoToken !== undefined) {
        findforUpdate.expoToken = updateSubscriptionDto.expoToken
      }

      if (updateSubscriptionDto.startDate !== undefined) {
        findforUpdate.startDate = updateSubscriptionDto.startDate;
      }

      const updatedSubscription = await this.subscriptionRepository.save(findforUpdate);

      await this.cache.del(`subscriptions:${id}`);

      await this.clearUserSubscriptionsCache(user.id);

      await this.clearDashboardCache(user.id);

      return updatedSubscription;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 400);
    }
  }

  async remove(user: User, id: string) {
    try {
      if (!id) {
        throw new NotFoundException('Id not given');
      }

      const findforUpdate = await this.subscriptionRepository.findOneBy({
        id,
        clerkUserId: user.id,
      });

      if (findforUpdate?.clerkUserId !== user.id) {
        throw new ForbiddenException(
          "You can't delete other user's subscription",
        );
      }

      if (!findforUpdate) {
        throw new NotFoundException('Subscription not found');
      }

      await this.subscriptionRepository.delete({
        id,
        clerkUserId: user.id,
      });

      await this.cache.del(`subscriptions:${id}`);

      await this.clearUserSubscriptionsCache(user.id);

      await this.clearDashboardCache(user.id);

      return {
        message: 'Subscription deleted successfully',
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 400);
    }
  }

  async deleteAll(user: User) {

    try {

      await this.subscriptionRepository.delete({ clerkUserId: user.id })

      await this.clearUserSubscriptionsCache(user.id);

      await this.clearDashboardCache(user.id);

      return {
        message: "All The Data have been deleted"
      }

    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 400);
    }

  }

  private generateSubscriptionsListKey(userId: string, query?: any): string {
    const queryHash = JSON.stringify(query || {});
    return `subscriptions:list:user_${userId}:${queryHash}`;
  }

  private getUserCacheTagKey(userId: string): string {
    return `subscriptions:tag:user_${userId}`;
  }

  private async addCacheKeyToUserTag(userId: string, cacheKey: string): Promise<void> {
    try {
      const tagKey = this.getUserCacheTagKey(userId);
      const existingKeys = await this.cache.get<string[]>(tagKey) || [];

      if (!existingKeys.includes(cacheKey)) {
        existingKeys.push(cacheKey);

        await this.cache.set(tagKey, existingKeys, 30 * 60 * 1000);
      }
    } catch (error) {
      this.logger.warn(`Failed to add cache key to tag: ${error.message}`);
    }
  }

  private async clearUserSubscriptionsCache(userId: string): Promise<void> {
    try {
      const tagKey = this.getUserCacheTagKey(userId);
      const cacheKeys = await this.cache.get<string[]>(tagKey) || [];

      for (const key of cacheKeys) {
        await this.cache.del(key);
        this.logger.log(`CACHE CLEARED: ${key}`);
      }

      await this.cache.del(tagKey);
      this.logger.log(`CACHE TAG CLEARED: ${tagKey}`);

      const fallbackPatterns = [
        `subscriptions:list:user_${userId}:{}`,
        `subscriptions:list:user_${userId}:{"limit":50}`,
      ];

      for (const key of fallbackPatterns) {
        await this.cache.del(key);
      }

    } catch (error) {
      this.logger.error(`Error clearing cache for user ${userId}:`, error);
    }
  }

  private async clearDashboardCache(userId: string): Promise<void> {
    try {
      const userDashboardKey = `dashboard:user:${userId}`;
      const adminDashboardKey = `dashboard:admin:${userId}`;
      await this.cache.del(userDashboardKey);
      await this.cache.del(adminDashboardKey);

      this.logger.log(`DASHBOARD CACHE CLEARED for user: ${userId}`);
    } catch (error) {
      this.logger.warn(`Failed to clear dashboard cache: ${error.message}`);
    }
  }

}
