import { CreateSubscriberDto } from './dto/create-subscriber.dto';

import Subscriber from './subscriber.service';

interface SubscribersService {
  addSubscriber(subscriber: CreateSubscriberDto): Promise<Subscriber>;
  getAllSubscribers(
    params: Record<string, unknown>,
  ): Promise<{ data: Subscriber[] }>;
}

export default SubscribersService;
