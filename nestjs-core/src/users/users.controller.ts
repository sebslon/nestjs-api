import { Express, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FindOneParams } from '../utils/validators/param/find-one-params';

import { RequestWithUser } from '../authentication/types/request-with-user';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';

import { UsersService } from './users.service';

import { LocalFilesInterceptor } from '../utils/interceptors/local-files.interceptor';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
}
