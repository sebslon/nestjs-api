/// <reference types="node" />
import { DataSource, Repository } from 'typeorm';
import { FilesService } from 'src/files/files.service';
import { PrivateFilesService } from '../files-private/private-files.service';
import CreateUserDto from './dto/create-user.dto';
import User from './user.entity';
export declare class UsersService {
    private dataSource;
    private usersRepository;
    private readonly filesService;
    private readonly privateFilesService;
    constructor(dataSource: DataSource, usersRepository: Repository<User>, filesService: FilesService, privateFilesService: PrivateFilesService);
    getById(id: number): unknown;
    getByEmail(email: string): unknown;
    create(userData: CreateUserDto): unknown;
    getUserIfRefreshTokenMatches(refreshToken: string, userId: number): unknown;
    setCurrentRefreshToken(refreshToken: string, userId: number): any;
    addAvatar(userId: number, imageBuffer: Buffer, filename: string): unknown;
    deleteAvatar(userId: number): any;
    addPrivateFile(userId: number, imageBuffer: Buffer, filename: string): unknown;
    deletePrivateFile(userId: number, fileId: number): any;
    getPrivateFile(userId: number, fileId: number): unknown;
    getAllPrivateFiles(userId: number): unknown;
    removeRefreshToken(userId: number): unknown;
}
