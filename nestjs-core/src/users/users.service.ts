import * as bcrypt from 'bcrypt';
import { Connection, DataSource, In, Repository } from 'typeorm';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import StripeService from '../stripe/stripe.service';
import { FilesService } from '../files/files.service';
import { PrivateFilesService } from '../files-private/private-files.service';
import { DatabaseFilesService } from '../files-database/database-files.service';
import { LocalFilesService } from '../files-local/local-files.service';

import CreateUserDto from './dto/create-user.dto';
import { LocalFileDto } from '../files-local/dto/local-file.dto';

import User from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private stripeService: StripeService,
    private readonly filesService: FilesService,
    private readonly privateFilesService: PrivateFilesService,
    private readonly databaseFilesService: DatabaseFilesService,
    private localFilesService: LocalFilesService,
  ) {}

  async getById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (user) return user;

    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getManyByIds(ids: number[]) {
    return this.usersRepository.find({
      where: { id: In(ids) },
    });
  }

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (user) return user;

    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async create(userData: CreateUserDto) {
    const stripeCusomter = await this.stripeService.createCustomer(
      userData.name,
      userData.email,
    );

    const newUser = await this.usersRepository.create({
      ...userData,
      stripeCustomerId: stripeCusomter.id,
    });

    await this.usersRepository.save(newUser);
    return newUser;
  }

  async turnOnTwoFactorAuthentication(userId: number) {
    return this.usersRepository.update(userId, {
      isTwoFactorAuthenticationEnabled: true,
    });
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
    return this.usersRepository.update(userId, {
      twoFactorAuthenticationSecret: secret,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) return user;

    throw new UnauthorizedException('Refresh token does not match');
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, { currentHashedRefreshToken });
  }

  // Avatar saved in Amazon S3
  // async addAvatar(userId: number, imageBuffer: Buffer, filename: string) {
  //   // TODO: Check size of image, compress etc.
  //   const user = await this.getById(userId);

  //   if (user.avatar) {
  //     await this.usersRepository.update(userId, {
  //       ...user,
  //       avatar: null,
  //     });
  //     await this.filesService.deletePublicFile(user.avatar.id);
  //   }

  //   const avatar = await this.filesService.uploadPublicFile(
  //     imageBuffer,
  //     filename,
  //   );

  //   await this.usersRepository.update(userId, { ...user, avatar });
  //   return avatar;
  // }

  // Avatar saved in database
  // async addAvatar(userId: number, imageBuffer: Buffer, filename: string) {
  //   const queryRunner = this.dataSource.createQueryRunner();

  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     const user = await queryRunner.manager.findOne(User, {
  //       where: { id: userId },
  //     });

  //     const currentAvatarId = user.avatarId;
  //     const avatar =
  //       await this.databaseFilesService.uploadDatabaseFileWithQueryRunner(
  //         imageBuffer,
  //         filename,
  //         queryRunner,
  //       );

  //     await queryRunner.manager.update(User, userId, {
  //       avatarId: avatar.id,
  //     });

  //     if (currentAvatarId) {
  //       await this.databaseFilesService.deleteFileWithQueryRunner(
  //         currentAvatarId,
  //         queryRunner,
  //       );
  //     }

  //     await queryRunner.commitTransaction();

  //     return avatar;
  //   } catch {
  //     await queryRunner.rollbackTransaction();
  //     throw new InternalServerErrorException();
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  // Avatar saved on local disk
  async addAvatar(userId: number, fileData: LocalFileDto) {
    const avatar = await this.localFilesService.saveLocalFileData(fileData);
    await this.usersRepository.update(userId, {
      avatarId: avatar.id,
    });
  }

  async deleteAvatar(userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();

    const user = await this.getById(userId);
    const fileId = user.avatar?.id;

    if (fileId) {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        await queryRunner.manager.update(User, userId, {
          ...user,
          avatar: null,
        });
        await this.filesService.deletePublicFile(fileId, queryRunner);
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();

        throw new InternalServerErrorException();
      } finally {
        await queryRunner.release();
      }
    }
  }

  async addPrivateFile(userId: number, imageBuffer: Buffer, filename: string) {
    return this.privateFilesService.uploadPrivateFile(
      imageBuffer,
      userId,
      filename,
    );
  }

  async deletePrivateFile(userId: number, fileId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['files'],
    });

    if (!user.files.some((file) => file.id === fileId)) {
      throw new UnauthorizedException('This file does not belong to you.');
    }

    await this.privateFilesService.deletePrivateFile(fileId);
  }

  async getPrivateFile(userId: number, fileId: number) {
    const file = await this.privateFilesService.getPrivateFile(fileId);
    if (file.info.owner.id === userId) {
      return file;
    }
    throw new UnauthorizedException();
  }

  async getAllPrivateFiles(userId: number) {
    const userWithFiles = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['files'],
    });

    if (userWithFiles) {
      return Promise.all(
        userWithFiles.files.map(async (file) => {
          const url = await this.privateFilesService.generatePresignedUrl(
            file.key,
          );
          return {
            ...file,
            url,
          };
        }),
      );
    }

    throw new NotFoundException('User with this id does not exist');
  }

  async removeRefreshToken(userId: number) {
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }

  async updateMonthlySubscriptionStatus(
    stripeCustomerId: string,
    monthlySubscriptionStatus: string,
  ) {
    return this.usersRepository.update(
      { stripeCustomerId },
      { monthlySubscriptionStatus },
    );
  }

  async markEmailAsConfirmed(email: string) {
    return this.usersRepository.update(
      { email },
      {
        isEmailConfirmed: true,
      },
    );
  }

  markPhoneNumberAsConfirmed(userId: number) {
    return this.usersRepository.update(
      { id: userId },
      { isPhoneNumberConfirmed: true },
    );
  }

  async createWithGoogle(email: string, name: string) {
    const stripeCustomer = await this.stripeService.createCustomer(name, email);

    const newUser = await this.usersRepository.create({
      email,
      name,
      isRegisteredWithGoogle: true,
      stripeCustomerId: stripeCustomer.id,
    });

    await this.usersRepository.save(newUser);
    return newUser;
  }
}
