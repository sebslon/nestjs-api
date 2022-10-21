import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { CreateSubscriberDto } from './dto/create-subscriber.dto';

import { SubscribersService } from './subscribers.service';

// In case of use gRPC - this controller is not used and exported from the module

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  // @EventPattern({ cmd: 'add-subscriber' })
  // addSubscriber(subscriber: CreateSubscriberDto) {
  //   return this.subscribersService.addSubscriber(subscriber);
  // }
  @MessagePattern({ cmd: 'add-subscriber' })
  async addSubscriber(
    @Payload() subscriber: CreateSubscriberDto,
    @Ctx() context: RmqContext,
  ) {
    const newSubscriber = await this.subscribersService.addSubscriber(
      subscriber,
    );

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    channel.ack(originalMsg);

    return newSubscriber;
  }

  @MessagePattern({ cmd: 'get-all-subscribers' })
  getAllSubscribers() {
    return this.subscribersService.getAllSubscribers();
  }
}
