import { IMascotaRepository } from '../../../domain/ports/out/database/IPetRepository';
import { Mascota } from '../../../domain/entities/Pet';

export class UpdatePetUseCase {
  constructor(private readonly mascotaRepository: IMascotaRepository) {}

  async execute(id: string, datos: Partial<Mascota>): Promise<Mascota> {
    const existe = await this.mascotaRepository.buscarPorId(id);
    if (!existe) throw new Error("No se puede actualizar una mascota que no existe");

    // Aquí podrías añadir lógica para que solo el dueño pueda editarla
    return await this.mascotaRepository.actualizar(id, datos);
  }
}