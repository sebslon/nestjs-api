import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import EmailConfirmationGuard from '../email-confirmation/guards/email-confirmation.guard';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';

import { RequestWithUser } from '../authentication/types/request-with-user';

import StripeService from '../stripe/stripe.service';

import AddCreditCardDto from './dto/add-credit-card.dto';
import SetDefaultCreditCardDto from './dto/set-default-card.dto';

@Controller('credit-cards')
export default class CreditCardsController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async addCreditCard(
    @Body() creditCard: AddCreditCardDto,
    @Req() request: RequestWithUser,
  ) {
    return this.stripeService.attachCreditCard(
      creditCard.paymentMethodId,
      request.user.stripeCustomerId,
    );
  }

  @Get()
  @UseGuards(EmailConfirmationGuard)
  @UseGuards(JwtAuthenticationGuard)
  async getCreditCards(@Req() request: RequestWithUser) {
    return this.stripeService.listCreditCards(request.user.stripeCustomerId);
  }

  @Post('default')
  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  async setDefaultCard(
    @Body() creditCard: SetDefaultCreditCardDto,
    @Req() request: RequestWithUser,
  ) {
    await this.stripeService.setDefaultCreditCard(
      creditCard.paymentMethodId,
      request.user.stripeCustomerId,
    );
  }
}
