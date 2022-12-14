import { Response } from 'express';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';

import { RequestWithUser } from '../authentication/types/request-with-user';

import { UsersService } from '../users/users.service';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';

import { TwoFactorAuthenticationCodeDto } from './dto/two-factor-authentication.dto';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly usersService: UsersService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Post('authenticate')
  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  async authenticate(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
  ) {
    const isCodeValid =
      this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        request.user,
      );

    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code.');
    }

    const accessTokenCookie =
      this.authenticationService.getCookieWithJwtAccessToken(
        request.user.id,
        true,
      );

    request.res.setHeader('Set-Cookie', accessTokenCookie);

    return request.user;
  }

  @Post('generate')
  @UseGuards(JwtAuthenticationGuard)
  async register(@Res() response: Response, @Req() request: RequestWithUser) {
    const { otpauthUrl } =
      await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
        request.user,
      );

    return this.twoFactorAuthenticationService.pipeQrCodeStream(
      response,
      otpauthUrl,
    );
  }

  // After generating QRCode - send code from Google Authenticator to this endpoint
  @Post('turn-on')
  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  async turnOnTwoFactorAuthentication(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
  ) {
    const isCodeValid =
      this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        request.user,
      );

    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code.');
    }

    return this.usersService.turnOnTwoFactorAuthentication(request.user.id);
  }
}
