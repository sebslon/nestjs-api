import { Response } from 'express';
import { FindOneParams } from '../utils/validators/param/find-one-params';
import { RequestWithUser } from '../authentication/types/request-with-user';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    addPrivateFile(request: RequestWithUser, file: Express.Multer.File): unknown;
    getAllPrivateFiles(request: RequestWithUser): unknown;
    getPrivateFile(request: RequestWithUser, { id }: FindOneParams, response: Response): any;
    deletePrivateFile(request: RequestWithUser, { id }: FindOneParams): unknown;
    addAvatar(request: RequestWithUser, file: Express.Multer.File): unknown;
    deleteAvatar(request: RequestWithUser): unknown;
}
