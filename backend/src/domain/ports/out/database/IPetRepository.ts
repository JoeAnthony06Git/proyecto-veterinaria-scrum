// Puerto de salida (DB) - IPetRepository.ts
import { Mascota } from '../../../entities/Pet';

export interface IMascotaRepository {
  crear(mascota: Mascota): Promise<Mascota>;
  actualizar(id: string, mascota: Partial<Mascota>): Promise<Mascota>;
  eliminar(id: string): Promise<void>;
  buscarPorId(id: string): Promise<Mascota | null>;
  listarPorTutor(tutorId: string): Promise<Mascota[]>;
}