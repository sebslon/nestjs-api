import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LocalFilesService } from './local-files.service';

import LocalFile from './local-file.entity';
import LocalFilesController from './local-files.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LocalFile]), ConfigModule],
  controllers: [LocalFilesController],
  providers: [LocalFilesService],
  exports: [LocalFilesService],
})
export class LocalFilesModule {}
