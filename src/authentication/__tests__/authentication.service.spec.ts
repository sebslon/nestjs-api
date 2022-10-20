import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AuthenticationService } from '../authentication.service';
import { mockedConfigService } from '../../utils/mocks/config.service';

import { UsersService } from '../../users/users.service';
import { mockedJwtService } from '../../utils/mocks/jwt.service';

import User from '../../users/user.entity';

jest.mock('bcrypt');

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [
        // MOCK ConfigService and JwtService
        // MOCK DATABASE MODULE - remove modules which have database dependencies, mock them (avoid using modules)
        UsersService,
        AuthenticationService,
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
      ],
    }).compile();

    authenticationService = await module.get(AuthenticationService);
  });

  it('Should return a string when creating a cookie', () => {
    const userId = 1;
    expect(
      typeof authenticationService.getCookieWithJwtAccessToken(userId),
    ).toEqual('string');
  });
});
