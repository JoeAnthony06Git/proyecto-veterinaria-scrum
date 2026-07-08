import { Module } from '@nestjs/common';
import { DoctorController } from './DoctorController';
import { PrismaConsultationRepository } from '../../../out/persistence/repositories/PrismaConsultationRepository';
import { PrismaCartillaRepository } from '../../../out/persistence/repositories/PrismaCartillaRepository';
import { OllamaAdapter } from '../../../out/ai/OllamaAdapter';

@Module({
  controllers: [DoctorController],
  providers: [
    PrismaConsultationRepository,
    PrismaCartillaRepository,
    {
      provide: 'IAiService',
      useClass: OllamaAdapter,
    },
  ],
  exports: [PrismaConsultationRepository, PrismaCartillaRepository],
})
export class DoctorModule {}
