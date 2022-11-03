import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  Res,
  ParseIntPipe,
  StreamableFile,
} from '@nestjs/common';
import { Readable } from 'stream';
import { Response } from 'express';

import { DatabaseFilesService } from './database-files.service';

@Controller('database-files')
@UseInterceptors(ClassSerializerInterceptor)
export default class DatabaseFilesController {
  constructor(private readonly databaseFilesService: DatabaseFilesService) {}

  @Get(':id')
  async getDatabaseFileById(
    @Res() response: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const file = await this.databaseFilesService.getFileById(id);

    const stream = Readable.from(file.data);

    response.set({
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Content-Type': 'image',
    }); // to make browser able to recognize the file as an image

    return new StreamableFile(stream);
  }
}
