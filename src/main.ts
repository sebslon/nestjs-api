import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    // new ExcludeNullInterceptor(),
  ); // uses class-transformer - serialization (e.g user.entity)

  await app.listen(3001);
}
bootstrap();
