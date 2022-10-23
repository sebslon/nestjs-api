import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import Post from './post.entity';
import {
  PostSearchBody,
  PostSearchResult,
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

  async search(
    text: string,
    offset?: number,
    limit?: number,
    startId?: number,
  ) {
    let separateCount = 0;

    if (startId) {
      separateCount = await this.count(text, ['title', 'paragraphs']);
    }

    const { body } = await this.elasticsearchService.search<PostSearchResult>({
      index: this.index,
      from: offset,
      size: limit,
      body: {
        query: {
          bool: {
            should: {
              multi_match: {
                query: text,
                fields: ['title', 'paragraphs'],
              },
            },
            filter: {
              range: {
                id: {
                  gt: startId,
                },
              },
            },
          },
        },
        sort: {
          id: {
            order: 'asc',
          },
        },
      },
    });

    const results = body.hits.hits.map((item) => item._source);
    const count = body.hits.total;

    return {
      count: startId ? separateCount : count,
      results,
    };
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

  async count(query: string, fields: string[]) {
    const { body } = await this.elasticsearchService.count<PostSearchResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query,
            fields,
          },
        },
      },
    });

    return body.hits.total.value;
  }
}
