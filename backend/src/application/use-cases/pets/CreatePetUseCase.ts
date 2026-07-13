import { Injectable, Inject } from '@nestjs/common';
import { IMascotaRepository } from '../../../domain/ports/out/database/IPetRepository';
import { Mascota } from '../../../domain/entities/Pet';
import { IStorageService, UploadableFile } from '../../../domain/ports/out/storage/IStorageService';

@Injectable()
export class CreatePetUseCase {
  constructor(
    @Inject('IMascotaRepository') private readonly mascotaRepository: IMascotaRepository,
    @Inject('IStorageService') private readonly storageService: IStorageService,
  ) {}

  async execute(datos: any, tutorId: string, file?: UploadableFile): Promise<Mascota> {
    let fotoUrl = datos.fotoUrl;

    if (file) {
      fotoUrl = await this.storageService.uploadFile(file, 'photos');
    }

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
      fotoUrl
    );

    return await this.mascotaRepository.crear(nuevaMascota);
  }
}
