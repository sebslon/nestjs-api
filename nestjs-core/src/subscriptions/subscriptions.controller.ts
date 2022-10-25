import { Controller, Post, Req, UseGuards, Get } from '@nestjs/common';

import { RequestWithUser } from 'src/authentication/types/request-with-user';

import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';

import SubscriptionsService from './subscriptions.service';

@Controller('subscriptions')
export default class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('monthly')
  @UseGuards(JwtAuthenticationGuard)
  async createMonthlySubscription(@Req() request: RequestWithUser) {
    return this.subscriptionsService.createMonthlySubscription(
      request.user.stripeCustomerId,
    );
  }

  @Get('monthly')
  @UseGuards(JwtAuthenticationGuard)
  async getMonthlySubscription(@Req() request: RequestWithUser) {
    return this.subscriptionsService.getMonthlySubscription(
      request.user.stripeCustomerId,
    );
  }
}
