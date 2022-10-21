import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindOneParams } from '../utils/validators/param/find-one-params';
import { PaginationParams } from '../utils/validators/param/pagination-params';
import { RequestWithUser } from '../authentication/types/request-with-user';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    getPosts(search: string, { offset, limit, startId }: PaginationParams): unknown;
    getPostById({ id }: FindOneParams): unknown;
    createPost(post: CreatePostDto, req: RequestWithUser): unknown;
    updatePost(id: string, post: UpdatePostDto): unknown;
    deletePost(id: string): any;
}
