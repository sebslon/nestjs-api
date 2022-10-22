import {
  Body,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Post,
} from '@nestjs/common';

import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';

import ProductCategoriesService from './product-categories.service';

import CreateProductCategoryDto from './dto/create-product-category.dto';

@Controller('product-categories')
@UseInterceptors(ClassSerializerInterceptor)
export default class ProductCategoriesController {
  constructor(private readonly productsService: ProductCategoriesService) {}

  @Get()
  getAllProducts() {
    return this.productsService.getAllProductCategories();
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createProduct(@Body() productCategory: CreateProductCategoryDto) {
    return this.productsService.createProductCategory(productCategory);
  }
}
