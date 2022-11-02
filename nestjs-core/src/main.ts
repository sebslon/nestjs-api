import * as cookieParser from 'cookie-parser';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

import { CustomClassSerializerInterceptor } from './utils/interceptors/custom-class-serializer.interceptor';
import { rawBodyMiddleware } from './utils/middlewares/raw-body.middleware';
import { getLogLevels } from './utils/get-log-levels';

import CustomLogger from './logs/custom.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(process.env.NODE_ENV === 'production'),
  });

  app.useLogger(app.get(CustomLogger));

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new CustomClassSerializerInterceptor(app.get(Reflector)),
    // new ExcludeNullInterceptor(),
  ); // uses class-transformer - serialization (e.g user.entity)

  const configService: ConfigService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get('FRONTEND_URL'),
    credentials: true,
  });

  app.use(rawBodyMiddleware());

  config.update({
    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    region: configService.get('AWS_REGION'),
  });

  await app.listen(3001);
}

// runInCluster(bootstrap);
bootstrap();
