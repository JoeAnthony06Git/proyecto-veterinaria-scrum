import { Module } from '@nestjs/common';
import { DoctorController } from './DoctorController';
import { PrismaConsultationRepository } from '../../../out/persistence/repositories/PrismaConsultationRepository';
import { PrismaCartillaRepository } from '../../../out/persistence/repositories/PrismaCartillaRepository';
import { GroqAdapter } from '../../../out/ai/GroqAdapter';

@Module({
  controllers: [DoctorController],
  providers: [
    PrismaConsultationRepository,
    PrismaCartillaRepository,
    {
      provide: 'IAiService',
      useClass: GroqAdapter,
    },
  ],
  exports: [PrismaConsultationRepository, PrismaCartillaRepository],
})
export class DoctorModule {}
