// Repositorio - PrismaPetRepository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../PrismaService'; // Ajusta la ruta si es necesario
import { IMascotaRepository } from '../../../../../domain/ports/out/database/IPetRepository';
import { Mascota } from '../../../../../domain/entities/Pet';

@Injectable()
export class PrismaMascotaRepository implements IMascotaRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 1. CREAR MASCOTA
  async crear(mascota: Mascota): Promise<Mascota> {
    const creada = await this.prisma.pet.create({
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
      },
    });
    return this.mapearADominio(creada);
  }

  // 2. LISTAR POR TUTOR (Para tu Dashboard)
  async listarPorTutor(tutorId: string): Promise<Mascota[]> {
    const pets = await this.prisma.pet.findMany({
      where: { tutorId },
      orderBy: { createdAt: 'desc' }
    });
    return pets.map(pet => this.mapearADominio(pet));
  }

  // 3. BUSCAR POR ID (Para ver el perfil)
  async buscarPorId(id: string): Promise<Mascota | null> {
    const pet = await this.prisma.pet.findUnique({
      where: { id },
      // Podrías incluir vacunas aquí si quieres en el futuro:
      // include: { vaccines: true } 
    });
    
    if (!pet) return null;
    return this.mapearADominio(pet);
  }

  // 4. ACTUALIZAR
  async actualizar(id: string, datos: Partial<Mascota>): Promise<Mascota> {
    const actualizada = await this.prisma.pet.update({
      where: { id },
      data: {
        name: datos.nombre,
        species: datos.especie,
        breed: datos.raza,
        sex: datos.sexo,
        birthDate: datos.fechaNacimiento,
        weightKg: datos.pesoKg,
        color: datos.color,
      },
    });
    return this.mapearADominio(actualizada);
  }

  // 5. ELIMINAR
  async eliminar(id: string): Promise<void> {
    await this.prisma.pet.delete({
      where: { id },
    });
  }

  /**
   * MAPPER: El "traductor" de Infraestructura (Inglés/Prisma) 
   * a Dominio (Español/TypeScript puro)
   */
  private mapearADominio(pet: any): Mascota {
    return new Mascota(
      pet.id,
      pet.name,
      pet.species,
      pet.breed,
      pet.sex as any,
      pet.birthDate,
      pet.weightKg,
      pet.color,
      pet.tutorId
    );
  }
}