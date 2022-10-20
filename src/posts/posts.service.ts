import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

import { PostNotFoundException } from './exceptions/post-not-found.exception';

import Post from './post.entity';
import User from '../users/user.entity';

import PostsSearchService from './post-search.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private postsSearchService: PostsSearchService,
  ) {}

  getAllPosts() {
    return this.postsRepository.find({ relations: ['author'] });
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

    return newPost;
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);

    if (!deleteResponse.affected) throw new PostNotFoundException(id);

    this.postsSearchService.remove(id);
  }

  async searchForPosts(text: string) {
    const results = await this.postsSearchService.search(text);
    const ids = results.map((result) => result.id);

    if (!ids.length) return [];

    return this.postsRepository.find({ where: { id: In(ids) } });
  }
}
