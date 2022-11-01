import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from '../users/users.module';
import { AuthenticationModule } from '../authentication/authentication.module';

import { GoogleAuthenticationController } from './google-authentication.controller';
import { GoogleAuthenticationService } from './google-authentication.service';

@Module({
  imports: [ConfigModule, UsersModule, AuthenticationModule],
  providers: [GoogleAuthenticationService],
  controllers: [GoogleAuthenticationController],
  exports: [],
})
export class GoogleAuthenticationModule {}
