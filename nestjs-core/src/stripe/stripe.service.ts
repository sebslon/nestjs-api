import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Stripe } from 'stripe';

@Injectable()
export default class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2022-08-01',
    });
  }

  async createCustomer(name: string, email: string) {
    return this.stripe.customers.create({
      name,
      email,
    });
  }

  async charge(amount: number, paymentMethodId: string, customerId: string) {
    return this.stripe.paymentIntents.create({
      amount,
      customer: customerId,
      payment_method: paymentMethodId, // sent by frontend
      currency: this.configService.get('STRIPE_CURRENCY'),
      confirm: true, // should be confirmed immediately? https://stripe.com/docs/api/payment_intents/confirm
    });
  }
}
