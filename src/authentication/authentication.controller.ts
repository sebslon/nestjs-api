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

import { AuthenticationService } from './authentication.service';

import { LocalAuthenticationGuard } from './guards/local-authentication.guard';
import JwtAuthenticationGuard from './guards/jwt-authentication.guard';

@Controller('authentication')
@SerializeOptions({ strategy: 'excludeAll' }) // serialization (e.g user.entity) with global interceptor
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    return user;
  }

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;

    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);

    // response.setHeader('Set-Cookie', cookie);
    request.res.setHeader('Set-Cookie', cookie);

    return response.send(user);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );
    return response.sendStatus(200);
  }
}
