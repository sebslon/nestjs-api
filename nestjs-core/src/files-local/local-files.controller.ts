import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  StreamableFile,
  Res,
  ParseIntPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

import { LocalFilesService } from './local-files.service';

@Controller('local-files')
@UseInterceptors(ClassSerializerInterceptor)
export default class LocalFilesController {
  constructor(private readonly localFilesService: LocalFilesService) {}

  @Get(':id')
  async getLocalFileById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) response: Response,
  ) {
    const file = await this.localFilesService.getFileById(id);

    const stream = createReadStream(join(process.cwd(), file.path)); // take file from disk

    response.set({
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Content-Type': file.mimetype,
    });
    return new StreamableFile(stream);
  }
}
