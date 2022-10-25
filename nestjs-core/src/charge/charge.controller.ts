import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

import { RequestWithUser } from '../authentication/types/request-with-user';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';

import StripeService from '../stripe/stripe.service';

import CreateChargeDto from './dto/create-charge.dto';

@Controller('charge')
export default class ChargeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createCharge(
    @Body() charge: CreateChargeDto,
    @Req() request: RequestWithUser,
  ) {
    return await this.stripeService.charge(
      charge.amount,
      charge.paymentMethodId,
      request.user.stripeCustomerId,
    );
  }
}
