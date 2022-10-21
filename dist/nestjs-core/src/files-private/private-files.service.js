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
exports.PrivateFilesService = void 0;
const uuid_1 = require("uuid");
const aws_sdk_1 = require("aws-sdk");
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const private_file_entity_1 = require("./private-file.entity");
let PrivateFilesService = class PrivateFilesService {
    constructor(privateFilesRepository, configService) {
        this.privateFilesRepository = privateFilesRepository;
        this.configService = configService;
    }
    async uploadPrivateFile(dataBuffer, ownerId, filename) {
        const s3 = new aws_sdk_1.S3();
        const uploadResult = await s3
            .upload({
            Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
            Body: dataBuffer,
            Key: `${(0, uuid_1.v4)()}-${filename}`,
        })
            .promise();
        const newFile = this.privateFilesRepository.create({
            key: uploadResult.Key,
            owner: {
                id: ownerId,
            },
        });
        await this.privateFilesRepository.save(newFile);
        return newFile;
    }
    async deletePrivateFile(id) {
        const file = await this.privateFilesRepository.findOne({
            where: { id },
        });
        const s3 = new aws_sdk_1.S3();
        await s3
            .deleteObject({
            Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
            Key: file.key,
        })
            .promise();
        await this.privateFilesRepository.delete(id);
    }
    async getPrivateFile(fileId) {
        const s3 = new aws_sdk_1.S3();
        const fileInfo = await this.privateFilesRepository.findOne({
            where: { id: fileId },
            relations: ['owner'],
        });
        if (fileInfo) {
            const stream = await s3
                .getObject({
                Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
                Key: fileInfo.key,
            })
                .createReadStream();
            return {
                stream,
                info: fileInfo,
            };
        }
        throw new common_1.NotFoundException();
    }
    async generatePresignedUrl(key) {
        const s3 = new aws_sdk_1.S3();
        return s3.getSignedUrlPromise('getObject', {
            Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
            Key: key,
        });
    }
};
PrivateFilesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(private_file_entity_1.default)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        config_1.ConfigService])
], PrivateFilesService);
exports.PrivateFilesService = PrivateFilesService;
//# sourceMappingURL=private-files.service.js.map