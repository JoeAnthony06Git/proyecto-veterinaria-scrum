import { Module } from '@nestjs/common';
import { DoctorController } from './DoctorController';
import { PrismaConsultationRepository } from '../../../out/persistence/repositories/PrismaConsultationRepository';
import { PrismaCartillaRepository } from '../../../out/persistence/repositories/PrismaCartillaRepository';

@Module({
  controllers: [DoctorController],
  providers: [PrismaConsultationRepository, PrismaCartillaRepository],
  exports: [PrismaConsultationRepository, PrismaCartillaRepository],
})
export class DoctorModule {}
