// http\tutor\TutorController.ts
import { Controller, Get, Post, Body, Param, Patch, Put, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/JwtAuthGuard';
import { RolesGuard, Roles } from '../auth/RolesGuard';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/CurrentUser';

// Casos de uso de Citas (Joseph)
import { AgendarCitaUseCase } from '../../../../../application/use-cases/scheduling/ScheduleAppointmentUseCase';
import { ObtenerCitasUseCase } from '../../../../../application/use-cases/scheduling/GetAppointmentsUseCase';
import { PrismaService } from '../../../out/persistence/PrismaService';

// Casos de uso de Mascotas (Brianna)
import { CreatePetUseCase } from '../../../../../application/use-cases/pets/CreatePetUseCase';
import { GetPetsUseCase } from '../../../../../application/use-cases/pets/GetPetsUseCase';
import { GetPetByIdUseCase } from '../../../../../application/use-cases/pets/GetPetByIdUseCase';
import { UpdatePetUseCase } from '../../../../../application/use-cases/pets/UpdatePetUseCase';
import { DeletePetUseCase } from '../../../../../application/use-cases/pets/DeletePetUseCase';

@Controller('tutor')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.TUTOR)
export class TutorController {
  constructor(
    // Inyecciones de Citas (Joseph)
    private readonly agendarCitaUseCase: AgendarCitaUseCase,
    private readonly obtenerCitasUseCase: ObtenerCitasUseCase,
    private readonly prisma: PrismaService,

    // Inyecciones de Mascotas (Brianna)
    private readonly createPetUC: CreatePetUseCase,
    private readonly getPetsUC: GetPetsUseCase,
    private readonly getPetByIdUC: GetPetByIdUseCase,
    private readonly updatePetUC: UpdatePetUseCase,
    private readonly deletePetUC: DeletePetUseCase
  ) {}

  // =========================================================================
  // ENDPOINTS DE CITAS & SERVICIOS (Joseph)
  // =========================================================================

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

  // =========================================================================
  // ENDPOINTS DE MASCOTAS (Brianna)
  // =========================================================================

  @Post('pets')
  async crear(@Body() body: any, @CurrentUser('id') tutorId: string) {
    return await this.createPetUC.execute(body, tutorId);
  }

  @Get('pets')
  async listar(@CurrentUser('id') tutorId: string) {
    return await this.getPetsUC.execute(tutorId);
  }

  @Get('pets/:id')
  async obtenerPorId(@Param('id') id: string) {
    return await this.getPetByIdUC.execute(id);
  }

  @Put('pets/:id')
  async actualizar(@Param('id') id: string, @Body() body: any) {
    return await this.updatePetUC.execute(id, body);
  }

  @Delete('pets/:id')
  async eliminar(@Param('id') id: string) {
    return await this.deletePetUC.execute(id);
  }
}