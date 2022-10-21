import { Repository } from 'typeorm';
import { Controller, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GrpcMethod } from '@nestjs/microservices';

import { CreateSubscriberDto } from './dto/create-subscriber.dto';

import Subscriber from './subscriber.entity';

// In case of gRPC we don't have controller. We mark service as a controller.

// @Injectable()
@Controller()
export class SubscribersService {
  constructor(
    @InjectRepository(Subscriber)
    private subscribersRepository: Repository<Subscriber>,
  ) {}

  @GrpcMethod() // if using gRPC
  async addSubscriber(subscriber: CreateSubscriberDto) {
    const newSubscriber = await this.subscribersRepository.create(subscriber);
    await this.subscribersRepository.save(newSubscriber);
    return newSubscriber;
  }

  @GrpcMethod()
  async getAllSubscribers() {
    const data = await this.subscribersRepository.find();
    return {
      data,
    };
  }
}
