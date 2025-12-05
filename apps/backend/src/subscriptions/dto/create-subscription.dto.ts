import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { SubscriptionType } from '../entities/subscription.entity';

export class CreateSubscriptionDto {
  @ApiProperty({
    example: 'Premium Membership',
    description: 'The title of the subscription',
  })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  title: string;

  @ApiProperty({
    example: 499,
    description: 'Subscription amount',
  })
  @IsNotEmpty({ message: 'Amount is required' })
  @IsNumber()
  amount: number;

  @ApiProperty({
    enum: SubscriptionType,
    example: SubscriptionType.MONTHLY,
    description: 'Type of subscription',
  })
  @IsEnum(SubscriptionType, {
    message: `Type must be one of ${Object.values(SubscriptionType).join(', ')}`,
  })
  type: SubscriptionType;

  @ApiProperty({
    example: true,
    description: 'Enable or disable notifications',
  })
  @IsNotEmpty({ message: 'Notifications is required' })
  @IsBoolean({ message: 'Notifications must be a boolean' })
  notifications: boolean;

  @ApiProperty({
    example: 'Software',
    description: 'Category of subscription',
  })
  @IsNotEmpty({ message: 'Category is required' })
  @IsString()
  category: string;
}
