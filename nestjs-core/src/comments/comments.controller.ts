import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';
import { RequestWithUser } from '../authentication/types/request-with-user';

import { CreateCommentCommand } from './commands/implementations/create-comment.command';

import { GetCommentsQuery } from './queries/implementations/get-comments.query';

import CreateCommentDto from './dto/create-comment.dto';
import GetCommentsDto from './dto/get-comments.dto';

@Controller('comments')
@UseInterceptors(ClassSerializerInterceptor)
export default class CommentsController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createComment(
    @Body() comment: CreateCommentDto,
    @Req() req: RequestWithUser,
  ) {
    const user = req.user;

    return this.commandBus.execute(new CreateCommentCommand(comment, user));
  }

  @Get()
  async getComments(@Query() { postId }: GetCommentsDto) {
    return this.queryBus.execute(new GetCommentsQuery(postId));
  }
}
