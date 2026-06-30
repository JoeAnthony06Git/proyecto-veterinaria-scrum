import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/JwtAuthGuard';
import { RolesGuard, Roles } from '../auth/RolesGuard';
import { Role } from '@prisma/client';
import { AgendarCitaUseCase } from '../../../../../application/use-cases/scheduling/ScheduleAppointmentUseCase';
import { ObtenerCitasUseCase } from '../../../../../application/use-cases/scheduling/GetAppointmentsUseCase';
import { PrismaService } from '../../../out/persistence/PrismaService';
import { CurrentUser } from '../auth/CurrentUser';

@Controller('tutor')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.TUTOR)
export class TutorController {
  constructor(
    private readonly agendarCitaUseCase: AgendarCitaUseCase,
    private readonly obtenerCitasUseCase: ObtenerCitasUseCase,
    private readonly prisma: PrismaService
  ) {}

  @Post('appointments')
  async agendarCita(@Body() datos: any) {
    return await this.agendarCitaUseCase.ejecutar(datos);
  }

  @Get('appointments')
  async obtenerCitas(@CurrentUser('id') tutorId: string) {
    return await this.obtenerCitasUseCase.listarParaTutor(tutorId);
  }

  @Patch('appointments/:id/cancel')
  async cancelarCita(@Param('id') id: string) {
    return await this.prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELADA' },
    });
  }

  @Get('services')
  async obtenerServicios() {
    return await this.prisma.service.findMany();
  }

  @Get('doctors')
  async obtenerDoctores() {
    return await this.prisma.user.findMany({
      where: { role: Role.DOCTOR },
      include: { doctorInfo: true },
    });
  }

  @Get('doctors/:id/availability')
  async obtenerDisponibilidadDoctor(@Param('id') doctorId: string) {
    return await this.prisma.appointment.findMany({
      where: {
        doctorId,
        status: 'PROGRAMADA',
      },
      select: {
        date: true,
        time: true,
      },
    });
  }
}