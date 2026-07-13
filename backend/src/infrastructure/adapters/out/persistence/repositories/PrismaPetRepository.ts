import { Injectable } from '@nestjs/common';
import { PrismaService } from '../PrismaService';
import { IMascotaRepository } from '../../../../../domain/ports/out/database/IPetRepository';
import { Mascota } from '../../../../../domain/entities/Pet';

@Injectable()
export class PrismaMascotaRepository implements IMascotaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(mascota: Mascota): Promise<Mascota> {
    const raw = await this.prisma.pet.create({
      data: {
        id: mascota.id,
        name: mascota.nombre,
        species: mascota.especie,
        breed: mascota.raza,
        sex: mascota.sexo,
        birthDate: mascota.fechaNacimiento,
        weightKg: mascota.pesoKg,
        color: mascota.color,
        tutorId: mascota.tutorId,
        fotoUrl: mascota.fotoUrl,
      },
    });
    return this.toDomain(raw);
  }

  async actualizar(id: string, mascota: any): Promise<Mascota> {
    const raw = await this.prisma.pet.update({
      where: { id },
      data: mascota,
    });

    return this.toDomain(raw);
  }

  async eliminar(id: string): Promise<void> {
    await this.prisma.pet.delete({ where: { id } });
  }

  async buscarPorId(id: string): Promise<Mascota | null> {
    const raw = await this.prisma.pet.findUnique({ where: { id } });
    if (!raw) return null;
    return this.toDomain(raw);
  }

  async listarPorTutor(tutorId: string): Promise<Mascota[]> {
    const raws = await this.prisma.pet.findMany({ where: { tutorId } });
    return raws.map((r) => this.toDomain(r));
  }

  private toDomain(raw: any): Mascota {
    return new Mascota(
      raw.id,
      raw.name,
      raw.species,
      raw.breed,
      raw.sex as 'Macho' | 'Hembra',
      raw.birthDate,
      raw.weightKg,
      raw.color,
      raw.tutorId,
      raw.fotoUrl || undefined,
    );
  }
}