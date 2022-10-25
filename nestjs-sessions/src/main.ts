import * as session from 'express-session';
import * as passport from 'passport';
import * as createRedisStore from 'connect-redis';
import { createClient } from 'redis';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const configService = app.get(ConfigService);

  const RedisStore = createRedisStore(session);
  const redisClient = createClient({
    host: configService.get('REDIS_HOST'),
    port: configService.get('REDIS_PORT'),
  });

  // https://docs.nestjs.com/techniques/session
  // https://stackoverflow.com/questions/40381401/when-to-use-saveuninitialized-and-resave-in-express-session
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: configService.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3002);
}
bootstrap();
