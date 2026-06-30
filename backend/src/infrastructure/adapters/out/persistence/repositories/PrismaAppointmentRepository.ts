import { Injectable } from '@nestjs/common';
import { PrismaService } from '../PrismaService';
import { IRepositorioCita } from '../../../../../domain/ports/out/database/IAppointmentRepository';
import { Cita } from '../../../../../domain/entities/Appointment';
import { EstadoCita } from '../../../../../domain/value-objects/AppointmentStatus';
import { AppointmentStatus as PrismaStatus } from '@prisma/client';

@Injectable()
export class PrismaRepositorioCita implements IRepositorioCita {
  constructor(private readonly prisma: PrismaService) {}

  async guardar(cita: Cita): Promise<void> {
    await this.prisma.appointment.create({
      data: {
        id: cita.id,
        petId: cita.mascotaId,
        tutorId: cita.tutorId,
        doctorId: cita.doctorId,
        serviceId: cita.servicioId,
        date: cita.fecha,
        time: cita.hora,
        status: cita.estado as PrismaStatus,
      },
    });
  }

  async buscarPorId(id: string): Promise<Cita | null> {
    const registro = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!registro) return null;

    return new Cita(
      registro.id,
      registro.petId,
      registro.tutorId,
      registro.doctorId,
      registro.serviceId,
      registro.date,
      registro.time,
      registro.status as unknown as EstadoCita,
      registro.createdAt
    );
  }

  async listarPorTutor(tutorId: string): Promise<Cita[]> {
    const registros = await this.prisma.appointment.findMany({
      where: { tutorId },
    });

    return registros.map((r: any) => new Cita(
        r.id,
        r.petId,
        r.tutorId,
        r.doctorId,
        r.serviceId,
        r.date,
        r.time,
        r.status as unknown as EstadoCita,
        r.createdAt,
        ));
  }

  async listarPorDoctor(doctorId: string): Promise<Cita[]> {
    const registros = await this.prisma.appointment.findMany({
      where: { doctorId },
    });

    return registros.map(
      (r) =>
        new Cita(
          r.id,
          r.petId,
          r.tutorId,
          r.doctorId,
          r.serviceId,
          r.date,
          r.time,
          r.status as unknown as EstadoCita,
          r.createdAt,
        ),
    );
  }

  async actualizarEstado(id: string, estado: EstadoCita): Promise<void> {
    await this.prisma.appointment.update({
      where: { id },
      data: { status: estado as PrismaStatus },
    });
  }
}