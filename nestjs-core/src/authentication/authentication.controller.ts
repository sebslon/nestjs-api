import { Response } from 'express';
import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Res,
  Get,
  SerializeOptions,
} from '@nestjs/common';

import RegisterDto from './dto/register.dto';

import { RequestWithUser } from './types/request-with-user';

import { UsersService } from '../users/users.service';
import { AuthenticationService } from './authentication.service';
import { EmailConfirmationService } from '../email-confirmation/email-confirmation.service';

import LocalAuthenticationGuard from './guards/local-authentication.guard';
import JwtAuthenticationGuard from './guards/jwt-authentication.guard';
import JwtRefreshGuard from './guards/jwt-refresh-authentication.guard';

@Controller('authentication')
@SerializeOptions({ strategy: 'excludeAll' }) // serialization (e.g user.entity) with global interceptor
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    return user;
  }

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    const user = await this.authenticationService.register(registrationData);

    await this.emailConfirmationService.sendVerificationLink(
      registrationData.email,
    );

    return user;
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;

    const accessTokenCookie =
      this.authenticationService.getCookieWithJwtAccessToken(user.id);
    const refreshTokenCookie =
      this.authenticationService.getCookieWithJwtRefreshToken(user.id);

    await this.usersService.setCurrentRefreshToken(
      refreshTokenCookie.token,
      user.id,
    );

    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie.cookie,
    ]);

    if (user.isTwoFactorAuthenticationEnabled) return;

    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    await this.usersService.removeRefreshToken(request.user.id);

    response.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookiesForLogOut(),
    );

    return response.sendStatus(200);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie =
      this.authenticationService.getCookieWithJwtAccessToken(request.user.id);

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }
}
