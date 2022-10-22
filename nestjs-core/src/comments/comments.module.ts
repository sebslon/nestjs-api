import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateCommentHandler } from './commands/handlers/create-comment.handler';
import { GetCommentsHandler } from './queries/handlers/get-comments.handler';

import Comment from './comment.entity';
import CommentsController from './comments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), CqrsModule],
  controllers: [CommentsController],
  providers: [CreateCommentHandler, GetCommentsHandler],
})
export class CommentsModule {}
