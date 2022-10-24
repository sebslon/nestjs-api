import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Inject, UseInterceptors } from '@nestjs/common';
import { Resolver, Subscription } from '@nestjs/graphql';

import { Post } from './models/post.model';

import { PUB_SUB } from '../pub-sub/pub-sub.module';

export const POST_ADDED_EVENT = 'postAdded'; // matches name of the method

@Resolver(() => Post)
@UseInterceptors()
export class PostsSubscriptionResolver {
  constructor(@Inject(PUB_SUB) private pubSub: RedisPubSub) {}

  @Subscription(() => Post, {
    filter: function (payload, variables) {
      return payload.postAdded.title !== 'Hello world!';
    },
    resolve: function (value) {
      return value; // modifying payload
    },
  })
  postAdded() {
    // every time we call pubSub.publish(POST_ADDED_EVENT), the clients who subscribed will receive the event.
    return this.pubSub.asyncIterator(POST_ADDED_EVENT);
  }
}
