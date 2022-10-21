import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import RegisterDto from './dto/register.dto';
export declare class AuthenticationService {
    private readonly usersService;
    private readonly jwtService;
    private readonly configService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    register(registrationData: RegisterDto): unknown;
    getAuthenticatedUser(email: string, plainTextPassword: string): unknown;
    getCookieWithJwtAccessToken(userId: number): string;
    getCookieWithJwtRefreshToken(userId: number): {
        cookie: string;
        token: string;
    };
    getCookiesForLogOut(): string[];
    private verifyPassword;
}
