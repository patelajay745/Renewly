import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './subscriptions/entities/subscription.entity';
import { CacheModule } from '@nestjs/cache-manager';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';
import { CacheableMemory } from 'cacheable';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'renewly',
      entities: [Subscription],
      // autoLoadEntities: true,
      synchronize: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          ttl: 60 * 1000,
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
            }),
            new Keyv({
              store: new KeyvRedis(process.env.REDIS_URL),
              namespace: process.env.REDIS_PREFIX,
            }),
          ],
        };
      },
    }),
    AuthModule,
    SubscriptionsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
