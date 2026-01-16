import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SubscriptionType {
  MONTHLY = 'monthly',
  WEEKLY = 'weekly',
  YEARLY = 'yearly',
}

@Entity({ name: 'subscriptions' })
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  clerkUserId: string;

  @Column()
  title: string;

  @Column({ type: "float" })
  amount: number;

  @Column({ type: 'enum', enum: SubscriptionType, default: null })
  type: SubscriptionType;

  @Column({ type: 'boolean', default: false })
  notification: boolean;

  @Column()
  category: string;

  @CreateDateColumn()
  startDate: Date;

  @Column({ nullable: true })
  expoToken: string

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
