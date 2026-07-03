import { Injectable, Inject } from '@nestjs/common';
import { IMascotaRepository } from '../../../domain/ports/out/database/IPetRepository';
import { Mascota } from '../../../domain/entities/Pet';

@Injectable()
export class GetPetsUseCase {
  constructor(@Inject('IMascotaRepository') private readonly mascotaRepository: IMascotaRepository) {}

  async execute(tutorId: string): Promise<Mascota[]> {
    return await this.mascotaRepository.listarPorTutor(tutorId);
  }
}
