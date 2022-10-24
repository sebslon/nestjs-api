import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Info,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import PostsLoaders from './loaders/posts.loaders';

import { GraphQLJwtAuthGuard } from '../authentication/guards/graphql-jwt-authentication.guard';
import { RequestWithUser } from '../authentication/types/request-with-user';

import { User } from '../users/models/user.model';

import { PostsService } from './posts.service';

import { CreatePostInput } from './inputs/post.input';

import { Post } from './models/post.model';

import { PUB_SUB } from '../pub-sub/pub-sub.module';
import { POST_ADDED_EVENT } from './posts-subscription.resolver';
@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private postsService: PostsService,
    private postsLoaders: PostsLoaders,
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
  ) {}

  @Query(() => [Post])
  async posts() {
    const posts = await this.postsService.getPostsWithAuthors();
    return posts.items;
  }

  @Mutation(() => Post)
  @UseGuards(GraphQLJwtAuthGuard)
  async createPost(
    @Args('input') createPostInput: CreatePostInput,
    @Context() context: { req: RequestWithUser },
  ) {
    const post = this.postsService.createPost(
      createPostInput,
      context.req.user,
    );
    this.pubSub.publish(POST_ADDED_EVENT, { postAdded: post });
    return post;
  }

  @ResolveField('author', () => User)
  async getAuthor(@Parent() post: Post) {
    const { authorId } = post;

    return this.postsLoaders.batchAuthors.load(authorId);
  }
}
