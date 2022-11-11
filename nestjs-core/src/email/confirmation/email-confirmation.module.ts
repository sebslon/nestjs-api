import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { EmailModule } from '../email.module';
import { UsersModule } from '../../users/users.module';

import { EmailConfirmationService } from './email-confirmation.service';
import { EmailConfirmationController } from './email-confirmation.controller';
import { FeatureFlagsModule } from 'src/feature-flags/feature-flags.module';

@Module({
  imports: [
    ConfigModule,
    EmailModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // returns value for EMAIL_CONFIG_OPTIONS provider
        service: configService.get('EMAIL_SERVICE'),
        user: configService.get('EMAIL_USER'),
        password: configService.get('EMAIL_PASSWORD'),
      }),
    }),
    JwtModule.register({}),
    FeatureFlagsModule,
    UsersModule,
  ],
  providers: [EmailConfirmationService],
  exports: [EmailConfirmationService],
  controllers: [EmailConfirmationController],
})
export class EmailConfirmationModule {}
