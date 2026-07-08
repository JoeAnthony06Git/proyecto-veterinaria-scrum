import { Module } from '@nestjs/common';
import { ShopController } from './ShopController';
import { ProductsController } from './ProductsController';
import { PrismaProductRepository } from '../../../out/persistence/repositories/PrismaProductRepository';

@Module({
  controllers: [ShopController, ProductsController],
  providers: [PrismaProductRepository],
  exports: [PrismaProductRepository],
})
export class ShopModule {}
