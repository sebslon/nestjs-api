import * as DataLoader from 'dataloader';
import { Injectable, Scope } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable({ scope: Scope.REQUEST })
export default class PostsLoaders {
  constructor(private usersService: UsersService) {}

  public readonly batchAuthors = new DataLoader(async (authorIds: number[]) => {
    const users = await this.usersService.getManyByIds(authorIds);
    const usersMap = new Map(users.map((user) => [user.id, user]));

    return authorIds.map((authorId) => usersMap.get(authorId));
  });
}
