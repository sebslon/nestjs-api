import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import Post from './post.entity';
import {
  PostSearchBody,
  // PostSearchResult,
} from './types/post-search.interface';

@Injectable()
export default class PostsSearchService {
  index = 'posts';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexPost(post: Post) {
    return this.elasticsearchService.index<PostSearchBody>({
      index: this.index,
      body: {
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.author.id,
      },
    });
  }

  async search(text: string) {
    const { hits } = await this.elasticsearchService.search<PostSearchBody>({
      index: this.index,
      body: {
        query: {
          // Search both through title & content
          multi_match: {
            query: text,
            fields: ['title', 'content'],
          },
        },
      },
    });

    return hits.hits.map((item) => item._source);
  }

  async remove(postId: number) {
    return await this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: postId,
          },
        },
      },
    });
  }

  async update(post: Post) {
    const newBody: PostSearchBody = {
      id: post.id,
      title: post.title,
      content: post.content,
      authorId: post.author.id,
    };

    // (..) ctx._source.title='New title'; ctx._source.content= 'New content';
    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key} = '${value}';`;
    }, '');

    return this.elasticsearchService.updateByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: post.id,
          },
        },
        script: { source: script },
      },
    });
  }
}
