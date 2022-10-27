import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UsersService } from '../users/users.service';

import PostgresErrorCode from '../database/errors/postgres-error-code.enum';

import StripeEvent from './stripe-event.entity';

@Injectable()
export default class StripeWebhookService {
  constructor(
    @InjectRepository(StripeEvent)
    private eventsRepository: Repository<StripeEvent>,
    private readonly usersService: UsersService,
  ) {}

  createEvent(id: string) {
    // this insert will throw an error if id is duplicated. Prevents duplicate events from being processed.
    return this.eventsRepository.insert({ id });
  }

  async processSubscriptionUpdate(event: Stripe.Event) {
    try {
      await this.createEvent(event.id);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException('This event was already processed');
      }
    }

    const data = event.data.object as Stripe.Subscription;

    const customerId: string = data.customer as string;
    const subscriptionStatus = data.status;

    await this.usersService.updateMonthlySubscriptionStatus(
      customerId,
      subscriptionStatus,
    );

    // Possible TODO: delete old events with CRON
  }
}
