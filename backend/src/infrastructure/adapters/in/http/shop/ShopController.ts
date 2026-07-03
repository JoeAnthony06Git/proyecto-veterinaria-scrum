import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/JwtAuthGuard';
import { RolesGuard, Roles } from '../auth/RolesGuard';
import { Role } from '@prisma/client';
import { PrismaProductRepository } from '../../../out/persistence/repositories/PrismaProductRepository';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.TUTOR, Role.DOCTOR)
export class ShopController {
  constructor(private readonly productRepo: PrismaProductRepository) {}

  @Get()
  async listarProductos(@Query('category') category?: string) {
    if (category) return await this.productRepo.findByCategory(category);
    return await this.productRepo.findAll();
  }

  @Get(':id')
  async obtenerProducto(@Param('id') id: string) {
    return await this.productRepo.findById(id);
  }
}
