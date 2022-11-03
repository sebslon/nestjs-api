import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';

import DatabaseFile from './database-file.entity';

@Injectable()
export class DatabaseFilesService {
  constructor(
    @InjectRepository(DatabaseFile)
    private databaseFilesRepository: Repository<DatabaseFile>,
  ) {}

  async uploadDatabaseFile(dataBuffer: Buffer, filename: string) {
    const newFile = await this.databaseFilesRepository.create({
      filename,
      data: dataBuffer,
    });
    return await this.databaseFilesRepository.save(newFile);
  }

  async getFileById(fileId: number) {
    const file = await this.databaseFilesRepository.findOne({
      where: { id: fileId },
    });

    if (!file) throw new NotFoundException();

    return file;
  }

  // for transactions
  async uploadDatabaseFileWithQueryRunner(
    dataBuffer: Buffer,
    filename: string,
    queryRunner: QueryRunner,
  ) {
    const newFile = await queryRunner.manager.create(DatabaseFile, {
      filename,
      data: dataBuffer,
    });
    await queryRunner.manager.save(DatabaseFile, newFile);
    return newFile;
  }

  // for transactions
  async deleteFileWithQueryRunner(fileId: number, queryRunner: QueryRunner) {
    const deleteResponse = await queryRunner.manager.delete(
      DatabaseFile,
      fileId,
    );
    if (!deleteResponse.affected) {
      throw new NotFoundException();
    }
  }
}
