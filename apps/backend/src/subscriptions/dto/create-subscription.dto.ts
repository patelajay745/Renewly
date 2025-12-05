import { IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';
import { SubscriptionType } from '../entities/subscription.entity';

export class CreateSubscriptionDto {
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsNotEmpty({ message: 'Amount is required' })
  amount: number;

  @IsEnum(SubscriptionType, {
    message: `Type must be one of ${Object.values(SubscriptionType).join(', ')}`,
  })
  type: SubscriptionType;

  @IsNotEmpty({ message: 'Notifications is required' })
  @IsBoolean({ message: 'Notifications must be a boolean' })
  notifications: boolean;

  @IsNotEmpty({ message: 'Category is required' })
  category: string;
}
