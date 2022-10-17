import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UsersService } from '../users.service';

import User from '../user.entity';

describe('UsersService', () => {
  let usersService: UsersService;
  let findOne: jest.Mock;

  beforeEach(async () => {
    findOne = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: { findOne },
        },
      ],
    }).compile();

    usersService = await module.get(UsersService);
  });

  it('Should return the user when getting by email and user is matched', async () => {
    const user = new User();
    findOne.mockReturnValue(Promise.resolve(user));

    const fetchedUser = await usersService.getByEmail('test@test.com');
    expect(fetchedUser).toEqual(user);
  });

  it('Should throw an error when getting by email and if user is not found', async () => {
    findOne.mockReturnValue(undefined);

    await expect(usersService.getByEmail('test@test.com')).rejects.toThrow();
  });
});
