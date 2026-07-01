import { Injectable } from '@nestjs/common';
import { PrismaService } from '../PrismaService';
import {
  ICartillaRepository,
  CartillaData,
} from '../../../../../domain/ports/out/database/ICartillaRepository';

@Injectable()
export class PrismaCartillaRepository implements ICartillaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getByPet(petId: string): Promise<CartillaData | null> {
    const pet = await this.prisma.pet.findUnique({
      where: { id: petId },
      include: {
        vaccines: { orderBy: { date: 'desc' } },
        medicalRecords: { orderBy: { date: 'desc' } },
        prescriptions: { orderBy: { date: 'desc' } },
      },
    });

    if (!pet) return null;

    return {
      pet: {
        id: pet.id,
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        sex: pet.sex,
        birthDate: pet.birthDate,
        weightKg: pet.weightKg,
        color: pet.color,
      },
      vaccines: pet.vaccines.map((v) => ({
        id: v.id,
        name: v.name,
        date: v.date,
        nextDose: v.nextDose,
        status: v.status,
      })),
      consultations: pet.medicalRecords.map((r) => ({
        id: r.id,
        date: r.date,
        reason: r.reason,
        symptoms: r.symptoms,
        diagnosis: r.diagnosis,
        treatment: r.treatment,
      })),
      prescriptions: pet.prescriptions.map((p) => ({
        id: p.id,
        date: p.date,
        originalText: p.originalText,
        status: p.status,
      })),
    };
  }
}
