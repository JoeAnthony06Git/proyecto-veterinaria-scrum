import { Injectable, Inject } from '@nestjs/common';
import { IMascotaRepository } from '../../../domain/ports/out/database/IPetRepository';
import { Mascota } from '../../../domain/entities/Pet';

@Injectable()
export class UpdatePetUseCase {
  constructor(@Inject('IMascotaRepository') private readonly mascotaRepository: IMascotaRepository) {}

  async execute(id: string, datos: Partial<Mascota>): Promise<Mascota> {
    const existe = await this.mascotaRepository.buscarPorId(id);
    if (!existe) throw new Error("No se puede actualizar una mascota que no existe");

    return await this.mascotaRepository.actualizar(id, datos);
  }
}
