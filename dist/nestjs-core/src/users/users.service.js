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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const bcrypt = require("bcrypt");
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("@nestjs/typeorm");
const files_service_1 = require("src/files/files.service");
const private_files_service_1 = require("../files-private/private-files.service");
const user_entity_1 = require("./user.entity");
let UsersService = class UsersService {
    constructor(dataSource, usersRepository, filesService, privateFilesService) {
        this.dataSource = dataSource;
        this.usersRepository = usersRepository;
        this.filesService = filesService;
        this.privateFilesService = privateFilesService;
    }
    async getById(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
        });
        if (user)
            return user;
        throw new common_1.HttpException('User with this id does not exist', common_1.HttpStatus.NOT_FOUND);
    }
    async getByEmail(email) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (user)
            return user;
        throw new common_1.HttpException('User with this email does not exist', common_1.HttpStatus.NOT_FOUND);
    }
    async create(userData) {
        const newUser = await this.usersRepository.create(userData);
        await this.usersRepository.save(newUser);
        return newUser;
    }
    async getUserIfRefreshTokenMatches(refreshToken, userId) {
        const user = await this.getById(userId);
        const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.currentHashedRefreshToken);
        if (isRefreshTokenMatching)
            return user;
        throw new common_1.UnauthorizedException('Refresh token does not match');
    }
    async setCurrentRefreshToken(refreshToken, userId) {
        const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.usersRepository.update(userId, { currentHashedRefreshToken });
    }
    async addAvatar(userId, imageBuffer, filename) {
        const user = await this.getById(userId);
        if (user.avatar) {
            await this.usersRepository.update(userId, Object.assign(Object.assign({}, user), { avatar: null }));
            await this.filesService.deletePublicFile(user.avatar.id);
        }
        const avatar = await this.filesService.uploadPublicFile(imageBuffer, filename);
        await this.usersRepository.update(userId, Object.assign(Object.assign({}, user), { avatar }));
        return avatar;
    }
    async deleteAvatar(userId) {
        var _a;
        const queryRunner = this.dataSource.createQueryRunner();
        const user = await this.getById(userId);
        const fileId = (_a = user.avatar) === null || _a === void 0 ? void 0 : _a.id;
        if (fileId) {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                await queryRunner.manager.update(user_entity_1.default, userId, Object.assign(Object.assign({}, user), { avatar: null }));
                await this.filesService.deletePublicFile(fileId, queryRunner);
                await queryRunner.commitTransaction();
            }
            catch (error) {
                await queryRunner.rollbackTransaction();
                throw new common_1.InternalServerErrorException();
            }
            finally {
                await queryRunner.release();
            }
        }
    }
    async addPrivateFile(userId, imageBuffer, filename) {
        return this.privateFilesService.uploadPrivateFile(imageBuffer, userId, filename);
    }
    async deletePrivateFile(userId, fileId) {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: ['files'],
        });
        if (!user.files.some((file) => file.id === fileId)) {
            throw new common_1.UnauthorizedException('This file does not belong to you.');
        }
        await this.privateFilesService.deletePrivateFile(fileId);
    }
    async getPrivateFile(userId, fileId) {
        const file = await this.privateFilesService.getPrivateFile(fileId);
        if (file.info.owner.id === userId) {
            return file;
        }
        throw new common_1.UnauthorizedException();
    }
    async getAllPrivateFiles(userId) {
        const userWithFiles = await this.usersRepository.findOne({
            where: { id: userId },
            relations: ['files'],
        });
        if (userWithFiles) {
            return Promise.all(userWithFiles.files.map(async (file) => {
                const url = await this.privateFilesService.generatePresignedUrl(file.key);
                return Object.assign(Object.assign({}, file), { url });
            }));
        }
        throw new common_1.NotFoundException('User with this id does not exist');
    }
    async removeRefreshToken(userId) {
        return this.usersRepository.update(userId, {
            currentHashedRefreshToken: null,
        });
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_2.InjectRepository)(user_entity_1.default)),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        typeorm_1.Repository, typeof (_a = typeof files_service_1.FilesService !== "undefined" && files_service_1.FilesService) === "function" ? _a : Object, private_files_service_1.PrivateFilesService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map