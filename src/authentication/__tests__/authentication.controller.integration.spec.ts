import * as request from 'supertest';
import { plainToClass } from 'class-transformer';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { mockedUser } from '../../utils/mocks/user.mock';
import { mockedJwtService } from '../../utils/mocks/jwt.service';
import { mockedConfigService } from '../../utils/mocks/config.service';

import { AuthenticationController } from '../authentication.controller';

import { UsersService } from '../../users/users.service';
import { AuthenticationService } from '../authentication.service';

import User from '../../users/user.entity';

describe('AuthenticationController', () => {
  let app: INestApplication;
  let userData: User;

  beforeEach(async () => {
    userData = { ...mockedUser };

    const usersRepository = {
      create: jest.fn().mockResolvedValue(plainToClass(User, userData)),
      save: jest.fn().mockReturnValue(Promise.resolve()),
    };

    const module = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        UsersService,
        AuthenticationService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: usersRepository,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('When registering', () => {
    describe('- and using valid data', () => {
      it('should respond with the data of the user without password', () => {
        const expectedData = { ...userData };
        delete expectedData.password;

        return request(app.getHttpServer())
          .post('/authentication/register')
          .send({
            name: mockedUser.name,
            email: mockedUser.email,
            password: 'password',
          })
          .expect(201)
          .expect(expectedData);
      });
    });

    describe('- and using invalid data', () => {
      it('should throw an error', () => {
        return request(app.getHttpServer())
          .post('/authentication/register')
          .send({
            name: mockedUser.name,
            email: 'invalid email',
            password: 'password',
          })
          .expect(400);
      });
    });
  });
});
