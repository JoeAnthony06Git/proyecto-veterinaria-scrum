import { Injectable, Inject } from '@nestjs/common';
import { IRepositorioCita } from '../../../domain/ports/out/database/IAppointmentRepository';
import { Cita } from '../../../domain/entities/Appointment';

@Injectable()
export class ObtenerCitasUseCase {
  constructor(@Inject('IRepositorioCita') private readonly repositorioCita: IRepositorioCita) {}

  async listarParaTutor(tutorId: string): Promise<Cita[]> {
    return await this.repositorioCita.listarPorTutor(tutorId);
  }

  async listarParaDoctor(doctorId: string): Promise<Cita[]> {
    return await this.repositorioCita.listarPorDoctor(doctorId);
  }
}
