import { Controller, Get, Query, Param } from '@nestjs/common';
import { PrismaProductRepository } from '../../../out/persistence/repositories/PrismaProductRepository';

@Controller('products')
export class ProductsController {
  constructor(private readonly productRepo: PrismaProductRepository) {}

  @Get()
  async listar(@Query('category') category?: string) {
    if (category && category !== 'Todos') {
      return await this.productRepo.findByCategory(category);
    }
    return await this.productRepo.findAll();
  }

  @Get(':id')
  async obtenerUno(@Param('id') id: string) {
    return await this.productRepo.findById(id);
  }
}