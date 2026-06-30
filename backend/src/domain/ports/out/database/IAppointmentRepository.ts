import { Cita } from '../../../entities/Appointment';
import { EstadoCita } from '../../../value-objects/AppointmentStatus';

export interface IRepositorioCita {
  guardar(cita: Cita): Promise<void>;
  buscarPorId(id: string): Promise<Cita | null>;
  listarPorTutor(tutorId: string): Promise<Cita[]>;
  listarPorDoctor(doctorId: string): Promise<Cita[]>;
  actualizarEstado(id: string, estado: EstadoCita): Promise<void>;
}