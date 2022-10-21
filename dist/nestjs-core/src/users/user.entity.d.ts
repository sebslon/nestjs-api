import Address from './address.entity';
import Post from '../posts/post.entity';
import PublicFile from '../files/public-file.entity';
import PrivateFile from '../files-private/private-file.entity';
declare class User {
    id?: number;
    email: string;
    name: string;
    password: string;
    currentHashedRefreshToken?: string;
    address: Address;
    posts: Post[];
    avatar?: PublicFile;
    files: PrivateFile[];
}
export default User;
