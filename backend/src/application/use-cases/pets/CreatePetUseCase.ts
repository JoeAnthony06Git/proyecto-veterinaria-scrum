import { IMascotaRepository } from '../../../domain/ports/out/database/IPetRepository';
import { Mascota } from '../../../domain/entities/Pet';

export class CreatePetUseCase {
  constructor(private readonly mascotaRepository: IMascotaRepository) {}

  async execute(datos: any, tutorId: string): Promise<Mascota> {
    // Regla de negocio básica
    if (datos.pesoKg <= 0) throw new Error("El peso de la mascota debe ser mayor a 0");

const nuevaMascota = new Mascota(
  crypto.randomUUID(),                       // 1. id (string)
  datos.nombre,                              // 2. nombre (string)
  datos.especie,                             // 3. especie (string)
  datos.raza,                                // 4. raza (string)
  datos.sexo as 'Macho' | 'Hembra',          // 5. sexo (casteado al tipo exacto del constructor)
  new Date(datos.fechaNacimiento),           // 6. fechaNacimiento (Date)
  Number(datos.pesoKg),                      // 7. pesoKg (number)
  datos.color,                               // 8. color (string)
  tutorId,                                   // 9. tutorId (string)
  datos.fotoUrl || undefined                 // 10. fotoUrl (opcional)
);

    return await this.mascotaRepository.crear(nuevaMascota);
  }
}