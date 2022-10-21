import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import Post from './post.entity';
import User from '../users/user.entity';
import PostsSearchService from './post-search.service';
export declare class PostsService {
    private postsRepository;
    private postsSearchService;
    constructor(postsRepository: Repository<Post>, postsSearchService: PostsSearchService);
    getAllPosts(offset?: number, limit?: number, startId?: number): unknown;
    getPostById(id: number): unknown;
    updatePost(id: number, post: UpdatePostDto): unknown;
    createPost(post: CreatePostDto, user: User): unknown;
    deletePost(id: number): any;
    searchForPosts(text: string, offset?: number, limit?: number, startId?: number): unknown;
    getPostsWithParagraph(paragraph: string): unknown;
}
