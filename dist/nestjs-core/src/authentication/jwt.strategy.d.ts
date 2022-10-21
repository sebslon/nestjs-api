import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { TokenPayload } from './types/token-payload.interface';
declare const JwtStrategy_base: new (...args: any[]) => InstanceType<T>;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    private readonly userService;
    constructor(configService: ConfigService, userService: UsersService);
    validate(payload: TokenPayload): unknown;
}
export {};
