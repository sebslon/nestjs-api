import {
  Controller,
  ClassSerializerInterceptor,
  UseInterceptors,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';

import { RequestWithUser } from '../../authentication/types/request-with-user';
import JwtAuthenticationGuard from '../../authentication/guards/jwt-authentication.guard';

import { EmailConfirmationService } from './email-confirmation.service';
import FeatureFlagGuard from 'src/feature-flags/feature-flag.guard';

import ConfirmEmailDto from './dto/confirm-email.dto';

@Controller('email-confirmation')
@UseInterceptors(ClassSerializerInterceptor)
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Post('confirm')
  @UseGuards(FeatureFlagGuard('email-confirmation'))
  async confirm(@Body() confirmationData: ConfirmEmailDto) {
    const email = await this.emailConfirmationService.decodeConfirmationToken(
      confirmationData.token,
    );
    await this.emailConfirmationService.confirmEmail(email);
  }

  @Post('resend-confirmation-link')
  @UseGuards(FeatureFlagGuard('email-confirmation'))
  @UseGuards(JwtAuthenticationGuard)
  async resendConfirmationLink(@Req() request: RequestWithUser) {
    await this.emailConfirmationService.resendConfirmationLink(request.user.id);
  }
}
