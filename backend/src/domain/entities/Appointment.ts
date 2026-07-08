import { EstadoCita } from '../value-objects/AppointmentStatus';

export class Cita {
  constructor(
    public readonly id: string,
    public readonly mascotaId: string,
    public readonly tutorId: string,
    public readonly doctorId: string,
    public readonly servicioId: string,
    public readonly fecha: Date,
    public readonly hora: string,
    private _estado: EstadoCita,
    public readonly creadoEn: Date,
    public readonly motivo: string | null = null
  ) {}

  get estado(): EstadoCita {
    return this._estado;
  }

  static crearNueva(
    id: string,
    mascotaId: string,
    tutorId: string,
    doctorId: string,
    servicioId: string,
    fecha: Date,
    hora: string,
    motivo?: string
  ): Cita {
    return new Cita(
      id,
      mascotaId,
      tutorId,
      doctorId,
      servicioId,
      fecha,
      hora,
      EstadoCita.PROGRAMADA,
      new Date(),
      motivo || null
    );
  }

  cancelar(): void {
    if (this._estado === EstadoCita.COMPLETADA) {
      throw new Error('No se puede cancelar una cita ya completada');
    }
    this._estado = EstadoCita.CANCELADA;
  }

  completar(): void {
    if (this._estado === EstadoCita.CANCELADA) {
      throw new Error('No se puede completar una cita cancelada');
    }
    this._estado = EstadoCita.COMPLETADA;
  }
}