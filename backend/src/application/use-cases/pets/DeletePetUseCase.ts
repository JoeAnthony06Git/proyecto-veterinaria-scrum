import { IMascotaRepository } from '../../../domain/ports/out/database/IPetRepository';

export class DeletePetUseCase {
  constructor(private readonly mascotaRepository: IMascotaRepository) {}

  async execute(id: string): Promise<void> {
    const existe = await this.mascotaRepository.buscarPorId(id);
    if (!existe) throw new Error("La mascota no existe");

    await this.mascotaRepository.eliminar(id);
  }
}