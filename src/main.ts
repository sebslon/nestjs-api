import * as cookieParser from 'cookie-parser';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

import { ExcludeNullInterceptor } from './utils/interceptors/exclude-null.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    // new ExcludeNullInterceptor(),
  ); // uses class-transformer - serialization (e.g user.entity)

  const configService: ConfigService = app.get(ConfigService);

  config.update({
    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    region: configService.get('AWS_REGION'),
  });

  await app.listen(3001);
}
bootstrap();
