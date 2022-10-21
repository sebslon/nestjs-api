import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubscribersService } from './subscribers.service';

import Subscriber from './subscriber.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscriber])],
  // providers: [SubscribersService],
  exports: [],
  // controllers: [SubscribersController], // not in gRPC microservice
  controllers: [SubscribersService], // in gRPC microservice
})
export class SubscribersModule {}
