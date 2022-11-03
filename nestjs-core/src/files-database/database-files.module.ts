import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseFilesService } from './database-files.service';

import DatabaseFile from './database-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DatabaseFile]), ConfigModule],
  providers: [DatabaseFilesService],
  exports: [DatabaseFilesService],
})
export class DatabaseFilesModule {}
