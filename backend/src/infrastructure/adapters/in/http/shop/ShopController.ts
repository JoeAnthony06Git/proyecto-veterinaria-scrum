import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/JwtAuthGuard';
import { PrismaProductRepository } from '../../../out/persistence/repositories/PrismaProductRepository';

@Controller('api/products')
@UseGuards(JwtAuthGuard)
export class ShopController {
  constructor(private readonly productRepo: PrismaProductRepository) {}

  @Get()
  async listarProductos(@Query('category') category?: string) {
    if (category) {
      return await this.productRepo.findByCategory(category);
    }
    return await this.productRepo.findAll();
  }
}
