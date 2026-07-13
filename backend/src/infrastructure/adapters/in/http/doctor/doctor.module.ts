import { Module } from '@nestjs/common';
import { DoctorController } from './DoctorController';
import { PrismaConsultationRepository } from '../../../out/persistence/repositories/PrismaConsultationRepository';
import { PrismaCartillaRepository } from '../../../out/persistence/repositories/PrismaCartillaRepository';
import { GroqAdapter } from '../../../out/ai/GroqAdapter';
import { EmailService } from '../../../../services/email.service';

@Module({
  controllers: [DoctorController],
  providers: [
    PrismaConsultationRepository,
    PrismaCartillaRepository,
    EmailService,
    {
      provide: 'IAiService',
      useClass: GroqAdapter,
    },
  ],
  exports: [PrismaConsultationRepository, PrismaCartillaRepository, EmailService],
})
export class DoctorModule {}
