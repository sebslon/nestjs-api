import { ClientProxy } from '@nestjs/microservices';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Inject,
} from '@nestjs/common';

import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';

import { CreateSubscriberDto } from './dto/create-subscriber.dto';

// the user calls the  /subscribers endpoint in our monolithic app,
// our application calls the microservice to get the necessary data,
// the microservice retrieves the data from its own database,
// our main application responds with the data.

@Controller('subscribers')
@UseInterceptors(ClassSerializerInterceptor)
export default class SubscribersController {
  constructor(
    @Inject('SUBSCRIBERS_SERVICE') private subscribersService: ClientProxy,
  ) {}

  // Message pattern (request/response)
  @Get()
  @UseGuards(JwtAuthenticationGuard)
  async getSubscribers() {
    return this.subscribersService.send(
      {
        cmd: 'get-all-subscribers',
      },
      '',
    );
  }

  // Event pattern (no need for response)
  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createSubscriber(@Body() subscriber: CreateSubscriberDto) {
    return this.subscribersService.emit(
      {
        cmd: 'add-subscriber',
      },
      subscriber,
    );
  }
}
