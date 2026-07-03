import { Injectable, Inject } from '@nestjs/common';
import { IMascotaRepository } from '../../../domain/ports/out/database/IPetRepository';
import { Mascota } from '../../../domain/entities/Pet';

@Injectable()
export class CreatePetUseCase {
  constructor(@Inject('IMascotaRepository') private readonly mascotaRepository: IMascotaRepository) {}

  async execute(datos: any, tutorId: string): Promise<Mascota> {
    if (datos.pesoKg <= 0) throw new Error("El peso de la mascota debe ser mayor a 0");

    const nuevaMascota = new Mascota(
      crypto.randomUUID(),
      datos.nombre,
      datos.especie,
      datos.raza,
      datos.sexo as 'Macho' | 'Hembra',
      new Date(datos.fechaNacimiento),
      Number(datos.pesoKg),
      datos.color,
      tutorId,
      datos.fotoUrl || undefined
    );

    return await this.mascotaRepository.crear(nuevaMascota);
  }
}
