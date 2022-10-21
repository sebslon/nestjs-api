"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationController = void 0;
const common_1 = require("@nestjs/common");
const register_dto_1 = require("./dto/register.dto");
const users_service_1 = require("../users/users.service");
const authentication_service_1 = require("./authentication.service");
const local_authentication_guard_1 = require("./guards/local-authentication.guard");
const jwt_authentication_guard_1 = require("./guards/jwt-authentication.guard");
const jwt_refresh_authentication_guard_1 = require("./guards/jwt-refresh-authentication.guard");
let AuthenticationController = class AuthenticationController {
    constructor(authenticationService, usersService) {
        this.authenticationService = authenticationService;
        this.usersService = usersService;
    }
    authenticate(request) {
        const user = request.user;
        return user;
    }
    async register(registrationData) {
        return this.authenticationService.register(registrationData);
    }
    async logIn(request) {
        const { user } = request;
        const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(user.id);
        const refreshTokenCookie = this.authenticationService.getCookieWithJwtRefreshToken(user.id);
        await this.usersService.setCurrentRefreshToken(refreshTokenCookie.token, user.id);
        request.res.setHeader('Set-Cookie', [
            accessTokenCookie,
            refreshTokenCookie.cookie,
        ]);
        return user;
    }
    async logOut(request, response) {
        await this.usersService.removeRefreshToken(request.user.id);
        response.setHeader('Set-Cookie', this.authenticationService.getCookiesForLogOut());
        return response.sendStatus(200);
    }
    refresh(request) {
        const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(request.user.id);
        request.res.setHeader('Set-Cookie', accessTokenCookie);
        return request.user;
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_authentication_guard_1.default),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthenticationController.prototype, "authenticate", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.default]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "register", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(local_authentication_guard_1.default),
    (0, common_1.Post)('log-in'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "logIn", null);
__decorate([
    (0, common_1.UseGuards)(jwt_authentication_guard_1.default),
    (0, common_1.Post)('log-out'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "logOut", null);
__decorate([
    (0, common_1.UseGuards)(jwt_refresh_authentication_guard_1.default),
    (0, common_1.Get)('refresh'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthenticationController.prototype, "refresh", null);
AuthenticationController = __decorate([
    (0, common_1.Controller)('authentication'),
    (0, common_1.SerializeOptions)({ strategy: 'excludeAll' }),
    __metadata("design:paramtypes", [authentication_service_1.AuthenticationService,
        users_service_1.UsersService])
], AuthenticationController);
exports.AuthenticationController = AuthenticationController;
//# sourceMappingURL=authentication.controller.js.map