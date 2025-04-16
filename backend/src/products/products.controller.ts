import {
  Controller, Get, Post, Patch, Delete, Param, Body,
  UseGuards, SetMetadata, Request, Query
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('role', 'admin')
  createProduct(@Body() body) {
    return this.productsService.createProduct(body.name, body.price, body.stock);
  }

  @Get()
  getAllProducts(@Query('category') category?: string) {
    return this.productsService.getAllProducts(category);
  }

  @Get(':id')
  getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(Number(id));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('role', 'admin')
  updateProduct(@Param('id') id: string, @Body() body) {
    return this.productsService.updateProduct(Number(id), body.name, body.price, body.stock);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('role', 'admin')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(Number(id));
  }

  @Post(':id/rate')
  @UseGuards(JwtAuthGuard)
  rateProduct(@Param('id') id: string, @Body() body) {
    return this.productsService.addRating(Number(id), body.rating);
  }

  @Get('recommendations/me')
  @UseGuards(JwtAuthGuard)
  getRecommendedProducts(@Request() req) {
    return this.productsService.getRecommendedProducts(req.user.id); // ✅
  }
  

}
