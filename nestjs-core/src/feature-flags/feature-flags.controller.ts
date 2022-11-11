import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FindOneParams } from '../utils/validators/param/find-one-params';
import FeatureFlagsService from './feature-flags.service';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';

import CreateFeatureFlagDto from './dto/create-feature-flag.dto';
import UpdateFeatureFlagDto from './dto/update-feature-flag.dto';

@Controller('feature-flags')
@UseInterceptors(ClassSerializerInterceptor)
export default class FeatureFlagsController {
  constructor(private readonly featureFlagsService: FeatureFlagsService) {}

  @Get()
  getAll() {
    return this.featureFlagsService.getAll();
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async create(@Body() featureFlag: CreateFeatureFlagDto) {
    return this.featureFlagsService.create(featureFlag);
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  async updateCategory(
    @Param() { id }: FindOneParams,
    @Body() category: UpdateFeatureFlagDto,
  ) {
    return this.featureFlagsService.update(+id, category);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  async deleteCategory(@Param() { id }: FindOneParams) {
    return this.featureFlagsService.delete(+id);
  }
}
