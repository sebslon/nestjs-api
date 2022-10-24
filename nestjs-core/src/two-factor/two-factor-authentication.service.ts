import { Response } from 'express';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UsersService } from '../users/users.service';

import User from '../users/user.entity';

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();

    const otpauthUrl = authenticator.keyuri(
      user.email,
      this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
      secret,
    );

    await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);

    return {
      secret,
      otpauthUrl,
    };
  }

  public isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    user: User,
  ) {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthenticationSecret,
    });
  }

  pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }
}
