/// <reference types="node" />
import { QueryRunner, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import PublicFile from './public-file.entity';
export declare class FilesService {
    private publicFilesRepository;
    private readonly configService;
    constructor(publicFilesRepository: Repository<PublicFile>, configService: ConfigService);
    uploadPublicFile(dataBuffer: Buffer, filename: string): unknown;
    deletePublicFile(fileId: number, queryRunner?: QueryRunner): unknown;
}
