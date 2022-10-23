import { CacheModule, Module } from '@nestjs/common';

import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SearchModule } from '../search/search.module';

import PostsSearchService from './post-search.service';

import Post from './post.entity';

@Module({
  imports: [
    CacheModule.register({ ttl: 5, max: 100 }),
    TypeOrmModule.forFeature([Post]),
    SearchModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsSearchService],
})
export class PostsModule {}
