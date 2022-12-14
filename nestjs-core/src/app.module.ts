import * as Joi from '@hapi/joi';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { BullModule } from '@nestjs/bull';

import { AppController } from './app.controller';

import { AppService } from './app.service';

import { ExceptionsLoggerFilter } from './utils/filters/exceptions-logger.filter';
import { Timestamp as TimestampScalar } from './utils/scalars/timestamp.scalar';

import { DatabaseModule } from './database/database.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { PostsModule } from './posts/posts.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { CommentsModule } from './comments/comments.module';
import { ProductsModule } from './products/products.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ChatModule } from './chat/chat.module';
import { PubSubModule } from './pub-sub/pub-sub.module';
import { OptimizeModule } from './optimize/optimize.module';
import { ChargeModule } from './charge/charge.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { StripeWebhookModule } from './stripe-webhook/stripe-webhook.module';
import { EmailSchedulingModule } from './email/scheduling/email-scheduling.module';
import { EmailConfirmationModule } from './email/confirmation/email-confirmation.module';
import { SmsModule } from './sms/sms.module';
import { GoogleAuthenticationModule } from './google-authentication/google-authentication.module';
import { LogsMiddleware } from './utils/middlewares/logs.middleware';
import { LoggerModule } from './logs/logs.module';
import { HealthModule } from './health/health.module';
import { DatabaseFilesModule } from './files-database/database-files.module';

@Module({
  imports: [
    PostsModule,
    UsersModule,
    AuthenticationModule,
    CategoriesModule,
    SubscribersModule,
    CommentsModule,
    ProductsModule,
    ProductCategoriesModule,
    EmailSchedulingModule,
    ChatModule,
    OptimizeModule,
    ChargeModule,
    SubscriptionsModule,
    StripeWebhookModule,
    EmailConfirmationModule,
    SmsModule,
    GoogleAuthenticationModule,
    LoggerModule,
    HealthModule,
    DatabaseFilesModule,
    BullModule.forRootAsync({
      // https://github.com/OptimalBits/bull/blob/master/REFERENCE.md#queue
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
        AWS_PRIVATE_BUCKET_NAME: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        EMAIL_SERVICE: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        GRAPHQL_PLAYGROUND: Joi.number(),
        STRIPE_SECRET_KEY: Joi.string(),
        STRIPE_CURRENCY: Joi.string(),
        STRIPE_SUBSCRIPTION_TRIAL_PERIOD: Joi.number(),
        STRIPE_WEBHOOK_SECRET: Joi.string(),
        MONTHLY_SUBSCRIPTION_PRICE_ID: Joi.string(),
        FRONTEND_URL: Joi.string(),
        // Email confirmation
        JWT_VERIFICATION_TOKEN_SECRET: Joi.string().required(),
        JWT_VERIFICATION_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        EMAIL_CONFIRMATION_URL: Joi.string().required(),
        // Verifying phone numbers with Twilio
        TWILIO_ACCOUNT_SID: Joi.string().required(),
        TWILIO_AUTH_TOKEN: Joi.string().required(),
        TWILIO_VERIFICATION_SERVICE_SID: Joi.string().required(),
        TWILIO_SENDER_PHONE_NUMBER: Joi.string().required(),
        GOOGLE_AUTH_CLIENT_ID: Joi.string().required(),
        GOOGLE_AUTH_CLIENT_SECRET: Joi.string().required(),
        UPLOADED_FILES_DESTINATION: Joi.string().required(),
        PORT: Joi.number(),
      }),
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule],
      inject: [ConfigService],
      driver: ApolloDriver,
      useFactory: (configService: ConfigService) => ({
        playground: Boolean(configService.get('GRAPHQL_PLAYGROUND')),
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        installSubscriptionHandlers: true,
        // subscriptions: {
        //   'graphql-ws': true,
        // },
        buildSchemaOptions: {
          dateScalarMode: 'timestamp',
        },
      }),
    }),
    DatabaseModule,
    ScheduleModule.forRoot(),
    PubSubModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: ExceptionsLoggerFilter },
    TimestampScalar,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
