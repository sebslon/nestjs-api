import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './types/token-payload.interface';
import { UsersService } from '../users/users.service';
declare const JwtRefreshTokenStrategy_base: new (...args: any[]) => InstanceType<T>;
export declare class JwtRefreshTokenStrategy extends JwtRefreshTokenStrategy_base {
    private readonly configService;
    private readonly userService;
    constructor(configService: ConfigService, userService: UsersService);
    validate(request: Request, payload: TokenPayload): unknown;
}
export {};
