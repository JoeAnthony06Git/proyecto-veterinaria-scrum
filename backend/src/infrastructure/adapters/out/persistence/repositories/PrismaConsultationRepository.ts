import { Injectable } from '@nestjs/common';
import { PrismaService } from '../PrismaService';
import { IConsultationRepository } from '../../../../../domain/ports/out/database/IConsultationRepository';
import { MedicalRecord } from '@prisma/client';

@Injectable()
export class PrismaConsultationRepository implements IConsultationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(data: {
    petId: string;
    doctorId: string;
    reason?: string;
    symptoms: string;
    diagnosis: string;
    treatment: string;
    transcribedText?: string;
  }): Promise<MedicalRecord> {
    return await this.prisma.medicalRecord.create({ data });
  }

  async findById(id: string): Promise<MedicalRecord | null> {
    return await this.prisma.medicalRecord.findUnique({ where: { id } });
  }

  async findByPet(petId: string): Promise<MedicalRecord[]> {
    return await this.prisma.medicalRecord.findMany({
      where: { petId },
      orderBy: { date: 'desc' },
    });
  }

  async findByDoctor(doctorId: string): Promise<MedicalRecord[]> {
    return await this.prisma.medicalRecord.findMany({
      where: { doctorId },
      orderBy: { date: 'desc' },
    });
  }

  async update(id: string, data: Partial<MedicalRecord>): Promise<MedicalRecord> {
    return await this.prisma.medicalRecord.update({
      where: { id },
      data,
    });
  }
}
