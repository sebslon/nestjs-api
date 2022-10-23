import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
  Req,
  Query,
  UseInterceptors,
  CacheKey,
  CacheTTL,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

import { FindOneParams } from '../utils/validators/param/find-one-params';
import { PaginationParams } from '../utils/validators/param/pagination-params';

import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';
import { RequestWithUser } from '../authentication/types/request-with-user';

import { GET_POSTS_CACHE_KEY } from './constants/posts-cache-key.constant';
import { HttpCacheInterceptor } from './cache/http-cache.interceptor';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @UseInterceptors(HttpCacheInterceptor) // can be used to cache whole controller/module
  @CacheKey(GET_POSTS_CACHE_KEY) // custom cache key
  @CacheTTL(100000) // cache for 2 minutes (custom value) (default is 5min)
  getPosts(
    @Query('search') search: string,
    @Query() { offset, limit, startId }: PaginationParams,
  ) {
    if (search) {
      return this.postsService.searchForPosts(search, offset, limit, startId);
    }

    return this.postsService.getAllPosts(offset, limit, startId);
  }

  @Get(':id')
  getPostById(@Param('id') { id }: FindOneParams) {
    return this.postsService.getPostById(+id);
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createPost(@Body() post: CreatePostDto, @Req() req: RequestWithUser) {
    return this.postsService.createPost(post, req.user);
  }

  @Patch(':id')
  async updatePost(@Param('id') id: string, @Body() post: UpdatePostDto) {
    return this.postsService.updatePost(Number(id), post);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    this.postsService.deletePost(Number(id));
  }
}
