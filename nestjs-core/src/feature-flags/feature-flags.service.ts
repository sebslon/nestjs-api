import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import PostgresErrorCode from '../database/errors/postgres-error-code.enum';
import FeatureFlag from './feature-flag.entity';

import CreateFeatureFlagDto from './dto/create-feature-flag.dto';
import UpdateFeatureFlagDto from './dto/update-feature-flag.dto';

@Injectable()
export default class FeatureFlagsService {
  constructor(
    @InjectRepository(FeatureFlag)
    private featureFlagsRepository: Repository<FeatureFlag>,
  ) {}

  getAll() {
    return this.featureFlagsRepository.find();
  }

  getByName(name: string) {
    return this.featureFlagsRepository.findOne({ where: { name } });
  }

  async create(featureFlag: CreateFeatureFlagDto) {
    try {
      const newFlag = await this.featureFlagsRepository.create(featureFlag);
      await this.featureFlagsRepository.save(newFlag);
      return newFlag;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'Feature flag already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, featureFlag: UpdateFeatureFlagDto) {
    try {
      await this.featureFlagsRepository.update(id, featureFlag);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'Feature flag with that name already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const updatedFeatureFlag = await this.featureFlagsRepository.findOne({
      where: {
        id,
      },
    });
    if (updatedFeatureFlag) {
      return updatedFeatureFlag;
    }
    throw new NotFoundException();
  }

  async delete(id: number) {
    const deleteResponse = await this.featureFlagsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new NotFoundException();
    }
  }

  async isEnabled(name: string) {
    const featureFlag = await this.getByName(name);
    if (!featureFlag) {
      return false;
    }
    return featureFlag.isEnabled;
  }
}
