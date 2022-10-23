import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SearchModule } from '../search/search.module';
import { PostsResolver } from './posts.resolver';

import PostsLoaders from './loaders/posts.loaders';
import PostsSearchService from './post-search.service';

import Post from './post.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    // CacheModule.register({ ttl: 5, max: 100 }), // memory cache
    CacheModule.register({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        ttl: 300,
      }),
    }),
    TypeOrmModule.forFeature([Post]),
    SearchModule,
    UsersModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsSearchService, PostsResolver, PostsLoaders],
})
export class PostsModule {}
