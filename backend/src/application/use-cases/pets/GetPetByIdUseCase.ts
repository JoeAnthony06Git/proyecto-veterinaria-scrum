import { Injectable, Inject } from '@nestjs/common';
import { IMascotaRepository } from '../../../domain/ports/out/database/IPetRepository';
import { Mascota } from '../../../domain/entities/Pet';

@Injectable()
export class GetPetByIdUseCase {
  constructor(@Inject('IMascotaRepository') private readonly mascotaRepository: IMascotaRepository) {}

  async execute(id: string): Promise<Mascota | null> {
    const mascota = await this.mascotaRepository.buscarPorId(id);
    if (!mascota) throw new Error("Mascota no encontrada");
    return mascota;
  }
}
