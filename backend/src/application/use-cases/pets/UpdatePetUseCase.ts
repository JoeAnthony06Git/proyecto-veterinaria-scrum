import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { IMascotaRepository } from '../../../domain/ports/out/database/IPetRepository';
import { Mascota } from '../../../domain/entities/Pet';
import { IStorageService, UploadableFile } from '../../../domain/ports/out/storage/IStorageService';

@Injectable()
export class UpdatePetUseCase {
  constructor(
    @Inject('IMascotaRepository') private readonly mascotaRepository: IMascotaRepository,
    @Inject('IStorageService') private readonly storageService: IStorageService,
  ) {}

  async execute(id: string, datos: any, tutorId: string, file?: UploadableFile): Promise<Mascota> {
    const existe = await this.mascotaRepository.buscarPorId(id);
    if (!existe) throw new Error("No existe la mascota");
    if (existe.tutorId !== tutorId) throw new ForbiddenException("No te pertenece");

    let fotoUrl = existe.fotoUrl; 
    if (file) {
      fotoUrl = await this.storageService.uploadFile(file, 'photos');
    }

    const mapeoDatos = {
      name: datos.nombre,
      species: datos.especie,
      breed: datos.raza,
      sex: datos.sexo,
      color: datos.color,
      fotoUrl: fotoUrl, // La nueva URL o la anterior
      weightKg: datos.pesoKg ? Number(datos.pesoKg) : undefined,
      birthDate: datos.fechaNacimiento ? new Date(datos.fechaNacimiento) : undefined,
    };

    return await this.mascotaRepository.actualizar(id, mapeoDatos);
  }
}
