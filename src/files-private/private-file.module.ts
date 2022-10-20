import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { PrivateFilesService } from './private-files.service';

import PrivateFile from './private-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrivateFile]), ConfigModule],
  providers: [PrivateFilesService],
  exports: [PrivateFilesService],
})
export class PrivateFilesModule {}
