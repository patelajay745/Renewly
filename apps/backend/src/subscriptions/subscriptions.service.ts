import {
  ForbiddenException,
  HttpException,
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
@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}
  async create(user: User, createSubscriptionDto: CreateSubscriptionDto) {
    try {
      const { title, amount, category, notifications, type } =
        createSubscriptionDto;

      const subscription = this.subscriptionRepository.save(
        this.subscriptionRepository.create({
          title,
          amount,
          category,
          notifications,
          type,
          clerkUserId: user.id,
        }),
      );

      if (!subscription) {
        throw new HttpException('Subscription already exists', 400);
      }

      return subscription;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findAll(user: User) {
    try {
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const subscriptions = await this.subscriptionRepository.find({
        where: {
          clerkUserId: user.id,
        },
      });

      if (!subscriptions) {
        throw new NotFoundException('No subscriptions found');
      }

      return subscriptions;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 400);
    }
  }

  async findOne(user: User, id: string) {
    try {
      const subscription = await this.subscriptionRepository.findOne({
        where: {
          id,
        },
      });

      if (!id) {
        throw new NotFoundException('Id not given');
      }

      if (!subscription) {
        throw new NotFoundException('Subscription not found');
      }
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
      const { amount, category, notifications, title, type } =
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
      });

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

      return {
        message: 'Subscription deleted successfully',
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 400);
    }
  }
}
