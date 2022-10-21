import User from '../users/user.entity';
declare class PrivateFile {
    id: number;
    key: string;
    owner: User;
}
export default PrivateFile;
