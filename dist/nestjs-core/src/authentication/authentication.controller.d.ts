import { Response } from 'express';
import RegisterDto from './dto/register.dto';
import { RequestWithUser } from './types/request-with-user';
import { UsersService } from '../users/users.service';
import { AuthenticationService } from './authentication.service';
export declare class AuthenticationController {
    private readonly authenticationService;
    private readonly usersService;
    constructor(authenticationService: AuthenticationService, usersService: UsersService);
    authenticate(request: RequestWithUser): import("../users/user.entity").default;
    register(registrationData: RegisterDto): unknown;
    logIn(request: RequestWithUser): unknown;
    logOut(request: RequestWithUser, response: Response): unknown;
    refresh(request: RequestWithUser): import("../users/user.entity").default;
}
