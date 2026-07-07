import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { IMascotaRepository } from '../../../domain/ports/out/database/IPetRepository';

@Injectable()
export class DeletePetUseCase {
  constructor(@Inject('IMascotaRepository') private readonly mascotaRepository: IMascotaRepository) {}

  async execute(id: string, tutorId?: string): Promise<void> {
    const existe = await this.mascotaRepository.buscarPorId(id);
    if (!existe) throw new Error("La mascota no existe");

    if (tutorId && existe.tutorId !== tutorId) {
      throw new ForbiddenException("No puedes eliminar una mascota que no te pertenece");
    }

    await this.mascotaRepository.eliminar(id);
  }
}
