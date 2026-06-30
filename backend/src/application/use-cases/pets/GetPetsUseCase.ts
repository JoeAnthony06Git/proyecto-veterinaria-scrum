import { IMascotaRepository } from '../../../domain/ports/out/database/IPetRepository';
import { Mascota } from '../../../domain/entities/Pet';

export class GetPetsUseCase {
  constructor(private readonly mascotaRepository: IMascotaRepository) {}

  async execute(tutorId: string): Promise<Mascota[]> {
    return await this.mascotaRepository.listarPorTutor(tutorId);
  }
}