import { Module } from '@nestjs/common';
import { StripeModule } from '../stripe/stripe.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';

import StripeEvent from './stripe-event.entity';

import StripeWebhookController from './stripe-webhook.controller';
import StripeWebhookService from './stripe-webhook.service';

@Module({
  imports: [StripeModule, UsersModule, TypeOrmModule.forFeature([StripeEvent])],
  controllers: [StripeWebhookController],
  providers: [StripeWebhookService],
})
export class StripeWebhookModule {}
