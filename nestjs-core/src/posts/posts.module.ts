import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { SearchModule } from '../search/search.module';
import { PostsResolver } from './posts.resolver';
import { PostsSubscriptionResolver } from './posts-subscription.resolver';

import PostsLoaders from './loaders/posts.loaders';
import PostsSearchService from './post-search.service';

import Post from './post.entity';

@Module({
  imports: [
    // CacheModule.register({ ttl: 5, max: 100 }), // memory cache
    CacheModule.register({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: 'redis',
        port: 6379,
        ttl: 300,
      }),
    }),
    TypeOrmModule.forFeature([Post]),
    SearchModule,
    UsersModule,
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsSearchService,
    PostsResolver,
    PostsLoaders,
    PostsSubscriptionResolver,
  ],
})
export class PostsModule {}
