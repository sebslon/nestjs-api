import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubscribersService } from './subscribers.service';

import Subscriber from './subscriber.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscriber])],
  controllers: [],
  providers: [SubscribersService],
  exports: [SubscribersService],
})
export class SubscribersModule {}
