import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module';

import { AuthenticationService } from './authentication.service';
import { TwoFactorAuthenticationService } from '../two-factor/two-factor-authentication.service';

import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshTokenStrategy } from './jwt-refresh.strategy';

import { AuthenticationController } from './authentication.controller';
import { TwoFactorAuthenticationController } from '../two-factor/two-factor-authentication.controller';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
        },
      }),
    }),
  ],
  providers: [
    AuthenticationService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    TwoFactorAuthenticationService,
  ],
  controllers: [AuthenticationController, TwoFactorAuthenticationController],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
