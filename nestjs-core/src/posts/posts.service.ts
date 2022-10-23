import { Cache } from 'cache-manager';
import { FindManyOptions, In, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

import { PostNotFoundException } from './exceptions/post-not-found.exception';

import Post from './post.entity';
import User from '../users/user.entity';

import PostsSearchService from './post-search.service';
import { GET_POSTS_CACHE_KEY } from './constants/posts-cache-key.constant';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private postsSearchService: PostsSearchService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // Caching manually
  ) {}

  async getAllPosts(offset?: number, limit?: number, startId?: number) {
    const where: FindManyOptions<Post>['where'] = {};
    let separateCount = 0;

    if (startId) {
      where.id = MoreThan(startId);
      separateCount = await this.postsRepository.count(); // otherwise it will count only the filtered posts
    }

    const [items, count] = await this.postsRepository.findAndCount({
      relations: ['author'],
      order: { id: 'ASC' },
      skip: offset,
      take: limit,
    });

    return { items, count: startId ? separateCount : count };
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (post) return post;

    throw new PostNotFoundException(id);
  }

  async updatePost(id: number, post: UpdatePostDto) {
    await this.postsRepository.update(id, post);

    const updatedPost = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (updatedPost) {
      await this.postsSearchService.update(updatedPost);
      await this.clearCache();
      return updatedPost;
    }

    throw new PostNotFoundException(id);
  }

  async createPost(post: CreatePostDto, user: User) {
    const newPost = await this.postsRepository.create({
      ...post,
      author: user,
    });

    await this.postsRepository.save(newPost);
    this.postsSearchService.indexPost(newPost);

    await this.clearCache();

    return newPost;
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);

    if (!deleteResponse.affected) throw new PostNotFoundException(id);

    await this.postsSearchService.remove(id);
    await this.clearCache();
  }

  async searchForPosts(
    text: string,
    offset?: number,
    limit?: number,
    startId?: number,
  ) {
    const { results, count } = await this.postsSearchService.search(
      text,
      offset,
      limit,
      startId,
    );
    const ids = results.map((result) => result.id);

    if (!ids.length) return [];

    const posts = this.postsRepository.find({ where: { id: In(ids) } });

    return posts;
  }

  async getPostsWithParagraph(paragraph: string) {
    return this.postsRepository.query(
      'SELECT * FROM post WHERE $1 = ANY(paragraphs)',
      [paragraph],
    );
  }

  // Invalidating cache after updating, deleting or creating a post
  private async clearCache() {
    const keys: string[] = await this.cacheManager.store.keys();

    keys.forEach((key) => {
      if (key.startsWith(GET_POSTS_CACHE_KEY)) this.cacheManager.del(key);
    });
  }
}
