import { Module } from '@nestjs/common';
import { ShopController } from './ShopController';
import { PrismaProductRepository } from '../../../out/persistence/repositories/PrismaProductRepository';

@Module({
  controllers: [ShopController],
  providers: [PrismaProductRepository],
  exports: [PrismaProductRepository],
})
export class ShopModule {}
