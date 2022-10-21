import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOneParams } from 'src/utils/validators/param/find-one-params';

import { CategoriesService } from './categories.service';

import Category from './category.entity';

import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @Get(':id')
  getCategoryById(@Param('id') { id }: FindOneParams) {
    return this.categoriesService.getCategoryById(+id);
  }

  @Patch(':id')
  updateCategory(@Param('id') id: string, @Body() category: UpdateCategoryDto) {
    return this.categoriesService.updateCategory(+id, category);
  }
}
