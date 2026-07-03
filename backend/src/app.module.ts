import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure/adapters/out/persistence/prisma.module';
import { AuthModule } from './infrastructure/adapters/in/http/auth/auth.module';
import { PetModule } from './infrastructure/adapters/out/persistence/pet.module';
import { DoctorModule } from './infrastructure/adapters/in/http/doctor/doctor.module';
import { ShopModule } from './infrastructure/adapters/in/http/shop/shop.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    PetModule,
    DoctorModule,
    ShopModule,
  ],
})
export class AppModule {}
