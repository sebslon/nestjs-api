import {
  Body,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Post,
  Param,
} from '@nestjs/common';

import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';

import CreateProductDto from './dto/create-product.dto';

import ProductsService from './products.service';

@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
export default class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Get('/:id/brand')
  getProductBrand(@Param('id') productId: number) {
    return this.productsService.getBrand(productId);
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createProduct(@Body() product: CreateProductDto) {
    return this.productsService.createProduct(product);
  }
}
