import User from '../users/user.entity';
import Category from '../categories/category.entity';
declare class Post {
    id: number;
    title: string;
    content: string;
    category?: string;
    author: User;
    categories: Category[];
    paragraphs: string[];
}
export default Post;
