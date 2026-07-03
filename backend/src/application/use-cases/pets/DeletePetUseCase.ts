import { Injectable, Inject } from '@nestjs/common';
import { IMascotaRepository } from '../../../domain/ports/out/database/IPetRepository';

@Injectable()
export class DeletePetUseCase {
  constructor(@Inject('IMascotaRepository') private readonly mascotaRepository: IMascotaRepository) {}

  async execute(id: string): Promise<void> {
    const existe = await this.mascotaRepository.buscarPorId(id);
    if (!existe) throw new Error("La mascota no existe");

    await this.mascotaRepository.eliminar(id);
  }
}
