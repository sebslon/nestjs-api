/// <reference types="node" />
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import PrivateFile from './private-file.entity';
export declare class PrivateFilesService {
    private privateFilesRepository;
    private readonly configService;
    constructor(privateFilesRepository: Repository<PrivateFile>, configService: ConfigService);
    uploadPrivateFile(dataBuffer: Buffer, ownerId: number, filename: string): unknown;
    deletePrivateFile(id: number): any;
    getPrivateFile(fileId: number): unknown;
    generatePresignedUrl(key: string): unknown;
}
