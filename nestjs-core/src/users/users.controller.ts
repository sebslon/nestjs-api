import etag from 'etag';
import { join } from 'path';
import { readFileSync } from 'fs';
import { Express, Response, Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FindOneParams } from '../utils/validators/param/find-one-params';

import { RequestWithUser } from '../authentication/types/request-with-user';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';

import { UsersService } from './users.service';
import { LocalFilesService } from 'src/files-local/local-files.service';

import { LocalFilesInterceptor } from '../utils/interceptors/local-files.interceptor';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly localFilesService: LocalFilesService,
  ) {}

  @Post('files')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addPrivateFile(
    @Req() request: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.addPrivateFile(
      request.user.id,
      file.buffer,
      file.originalname,
    );
  }

  @Get('files')
  @UseGuards(JwtAuthenticationGuard)
  async getAllPrivateFiles(@Req() request: RequestWithUser) {
    return this.usersService.getAllPrivateFiles(request.user.id);
  }

  @Get('files/:id')
  @UseGuards(JwtAuthenticationGuard)
  async getPrivateFile(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
    @Res() response: Response,
  ) {
    const file = await this.usersService.getPrivateFile(
      request.user.id,
      Number(id),
    );

    // Thanks to working directly with streams, we don’t have to download the file into the memory in our server.
    file.stream.pipe(response);
  }

  @Delete('files/:id')
  @UseGuards(JwtAuthenticationGuard)
  async deletePrivateFile(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ) {
    return this.usersService.deletePrivateFile(request.user.id, Number(id));
  }

  @Post('avatar')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'file',
      path: '/avatars',
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.includes('image')) {
          return cb(new BadRequestException('Provide a valid image'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: Math.pow(1024, 2), // 1mb
      },
    }),
  )
  async addAvatar(
    @Req() request: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.addAvatar(request.user.id, {
      path: file.path,
      filename: file.originalname,
      mimetype: file.mimetype,
    });
  }

  @Delete('avatar')
  @UseGuards(JwtAuthenticationGuard)
  async deleteAvatar(@Req() request: RequestWithUser) {
    return this.usersService.deleteAvatar(request.user.id);
  }

  @Get('userId/avatar')
  async getAvatar(
    @Param('userId', ParseIntPipe) userId: number,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    const user = await this.usersService.getById(userId);
    const fileId = user.avatarId;

    if (!fileId) throw new NotFoundException();

    const fileMetadata = await this.localFilesService.getFileById(fileId);
    const pathOnDisk = join(process.cwd(), fileMetadata.path);
    const file = readFileSync(pathOnDisk);

    const tag = etag(file);
    // const tag = `W/"file-id-${fileId}"`; // Custom weak etag

    response.set({
      'Content-Disposition': `inline; filename="${fileMetadata.filename}"`,
      'Content-Type': fileMetadata.mimetype,
      ETag: tag,
    });

    if (request.headers['if-none-match'] === tag) {
      // second request - browser then knows that the image didn't change and it can use the cached version
      response.status(304);
      return;
    }

    return new StreamableFile(file);
  }
}
