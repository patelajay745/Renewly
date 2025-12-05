import { HttpException, Injectable, Logger } from '@nestjs/common';
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

  findAll() {
    return `This action returns all subscriptions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscription`;
  }

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return `This action updates a #${id} subscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }
}
