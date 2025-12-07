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

      return saved;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findAll(user: User, query?: any) {
    if (!user) throw new NotFoundException('User not found');

    const cacheKey = this.generateSubscriptionsKey(user.id, query);

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

    if (!subscriptions?.length)
      throw new NotFoundException('No subscriptions found');

    await this.cache.set(cacheKey, subscriptions, 60000);


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

      await this.cache.set(cacheKey, subscription, 60000);
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
      const { amount, category, notifications, title, type, startDate } =
        updateSubscriptionDto;

      const findforUpdate = await this.subscriptionRepository.findOneBy({
        id,
      });

      if (findforUpdate?.clerkUserId !== user.id) {
        throw new ForbiddenException(
          "You can't update other user's subscription",
        );
      }

      if (!findforUpdate) {
        throw new NotFoundException('Subscription not found');
      }

      const updatedSubscription = await this.subscriptionRepository.save({
        ...findforUpdate,
        amount,
        category,
        notifications,
        title,
        type,
        startDate,
      });

      await this.cache.del(`subscription:${id}`);

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

      await this.cache.del(`subscription:${id}`);

      return {
        message: 'Subscription deleted successfully',
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 400);
    }
  }


  private generateSubscriptionsKey(userId: string, query?: any): string {
    const key = `subscriptions:user_${userId}:filter_${JSON.stringify(query || {})}`;
    return key;
  }

  
}
