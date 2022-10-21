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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const platform_express_1 = require("@nestjs/platform-express");
const common_1 = require("@nestjs/common");
const find_one_params_1 = require("../utils/validators/param/find-one-params");
const jwt_authentication_guard_1 = require("../authentication/guards/jwt-authentication.guard");
const users_service_1 = require("./users.service");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async addPrivateFile(request, file) {
        return this.usersService.addPrivateFile(request.user.id, file.buffer, file.originalname);
    }
    async getAllPrivateFiles(request) {
        return this.usersService.getAllPrivateFiles(request.user.id);
    }
    async getPrivateFile(request, { id }, response) {
        const file = await this.usersService.getPrivateFile(request.user.id, Number(id));
        file.stream.pipe(response);
    }
    async deletePrivateFile(request, { id }) {
        return this.usersService.deletePrivateFile(request.user.id, Number(id));
    }
    async addAvatar(request, file) {
        return this.usersService.addAvatar(request.user.id, file.buffer, file.originalname);
    }
    async deleteAvatar(request) {
        return this.usersService.deleteAvatar(request.user.id);
    }
};
__decorate([
    (0, common_1.Post)('files'),
    (0, common_1.UseGuards)(jwt_authentication_guard_1.default),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof express_1.Express !== "undefined" && (_a = express_1.Express.Multer) !== void 0 && _a.File) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addPrivateFile", null);
__decorate([
    (0, common_1.Get)('files'),
    (0, common_1.UseGuards)(jwt_authentication_guard_1.default),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllPrivateFiles", null);
__decorate([
    (0, common_1.Get)('files/:id'),
    (0, common_1.UseGuards)(jwt_authentication_guard_1.default),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, find_one_params_1.FindOneParams, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getPrivateFile", null);
__decorate([
    (0, common_1.Delete)('files/:id'),
    (0, common_1.UseGuards)(jwt_authentication_guard_1.default),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, find_one_params_1.FindOneParams]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deletePrivateFile", null);
__decorate([
    (0, common_1.Post)('avatar'),
    (0, common_1.UseGuards)(jwt_authentication_guard_1.default),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof express_1.Express !== "undefined" && (_c = express_1.Express.Multer) !== void 0 && _c.File) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addAvatar", null);
__decorate([
    (0, common_1.Delete)('avatar'),
    (0, common_1.UseGuards)(jwt_authentication_guard_1.default),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteAvatar", null);
UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map