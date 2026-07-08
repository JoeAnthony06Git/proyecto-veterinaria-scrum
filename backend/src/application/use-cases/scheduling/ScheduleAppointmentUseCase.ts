import { Injectable, Inject } from '@nestjs/common';
import { IRepositorioCita } from '../../../domain/ports/out/database/IAppointmentRepository';
import { Cita } from '../../../domain/entities/Appointment';

export interface DatosAgendarCita {
  id: string;
  mascotaId: string;
  tutorId: string;
  doctorId: string;
  servicioId: string;
  fecha: Date;
  hora: string;
  motivo?: string;
}

@Injectable()
export class AgendarCitaUseCase {
  constructor(@Inject('IRepositorioCita') private readonly repositorioCita: IRepositorioCita) {}

  async ejecutar(datos: DatosAgendarCita): Promise<Cita> {
    const cita = Cita.crearNueva(
      datos.id,
      datos.mascotaId,
      datos.tutorId,
      datos.doctorId,
      datos.servicioId,
      datos.fecha,
      datos.hora,
      datos.motivo
    );

    await this.repositorioCita.guardar(cita);
    return cita;
  }
}
