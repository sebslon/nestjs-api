import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import Comment from 'src/comments/comment.entity';
import { Repository } from 'typeorm';

import { CreateCommentCommand } from '../implementations/create-comment.command';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  // Handler invokes the execute method as soon as the command is dispatched
  async execute(command: CreateCommentCommand) {
    const comment = await this.commentsRepository.create({
      ...command.comment,
      author: command.author,
    });

    await this.commentsRepository.save(comment);

    return comment;
  }
}
