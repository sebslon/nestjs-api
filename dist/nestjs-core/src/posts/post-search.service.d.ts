import { ElasticsearchService } from '@nestjs/elasticsearch';
import Post from './post.entity';
export default class PostsSearchService {
    private readonly elasticsearchService;
    index: string;
    constructor(elasticsearchService: ElasticsearchService);
    indexPost(post: Post): unknown;
    search(text: string, offset?: number, limit?: number, startId?: number): unknown;
    remove(postId: number): unknown;
    update(post: Post): unknown;
    count(query: string, fields: string[]): unknown;
}
