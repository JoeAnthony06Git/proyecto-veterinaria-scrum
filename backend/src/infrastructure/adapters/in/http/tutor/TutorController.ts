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
    private readonly createPetUseCase: CreatePetUseCase,
    private readonly getPetsUseCase: GetPetsUseCase,
    private readonly getPetByIdUseCase: GetPetByIdUseCase,
    private readonly updatePetUseCase: UpdatePetUseCase,
    private readonly deletePetUseCase: DeletePetUseCase
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

  @Get('pets')
  async listarMascotas(@CurrentUser('id') tutorId: string) {
    return await this.getPetsUseCase.execute(tutorId);
  }

  @Get('pets/:id')
  async obtenerMascota(@Param('id') id: string) {
    const pet = await this.prisma.pet.findUnique({
      where: { id },
      include: {
        vaccines: { orderBy: { date: 'desc' } },
        medicalRecords: {
          orderBy: { date: 'desc' },
          include: { doctor: { select: { name: true, lastName: true } } },
        },
      },
    });

    if (!pet) return null;

    return {
      id: pet.id,
      nombre: pet.name,
      especie: pet.species,
      raza: pet.breed,
      sexo: pet.sex,
      pesoKg: pet.weightKg,
      tutorId: pet.tutorId,
      fechaNacimiento: pet.birthDate.toISOString(),
      color: pet.color,
      vaccines: pet.vaccines.map((v) => ({
        id: v.id,
        name: v.name,
        date: v.date.toISOString(),
        next: v.nextDose.toISOString(),
        status: v.status,
      })),
      consultations: pet.medicalRecords.map((r) => ({
        id: r.id,
        date: r.date.toISOString(),
        reason: r.reason || 'Consulta general',
        doctor: `${r.doctor.name} ${r.doctor.lastName}`,
      })),
    };
  }

  @Post('pets')
  async crearMascota(@CurrentUser('id') tutorId: string, @Body() datos: any) {
    return await this.createPetUseCase.execute(datos, tutorId);
  }

  @Put('pets/:id')
  async actualizarMascota(@Param('id') id: string, @Body() datos: any) {
    return await this.updatePetUseCase.execute(id, datos);
  }

  @Delete('pets/:id')
  async eliminarMascota(@Param('id') id: string) {
    return await this.deletePetUseCase.execute(id);
  }
}