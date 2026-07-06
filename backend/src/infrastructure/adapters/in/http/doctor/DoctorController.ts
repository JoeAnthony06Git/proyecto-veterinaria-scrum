import { Controller, Get, Post, Body, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/JwtAuthGuard';
import { RolesGuard, Roles } from '../auth/RolesGuard';
import { Role } from '@prisma/client';
import { PrismaService } from '../../../out/persistence/PrismaService';
import { CurrentUser } from '../auth/CurrentUser';

@Controller('doctor')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.DOCTOR)
export class DoctorController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('dashboard')
  async getDashboard(@CurrentUser('id') doctorId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [todayAppointments, patientCount, triageAlerts] = await Promise.all([
      this.prisma.appointment.findMany({
        where: { doctorId, date: { gte: today, lt: tomorrow } },
        include: { pet: true, tutor: true, service: true },
        orderBy: { time: 'asc' },
      }),
      this.prisma.pet.count(),
      this.prisma.triageReport.findMany({
        where: { status: 'PENDIENTE' },
        include: { pet: true, tutor: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      todayAppointments: todayAppointments.length,
      patientCount,
      triageAlerts: triageAlerts.length,
      emergencies: triageAlerts.filter((t) => t.urgency === 'CRITICA').length,
      appointments: todayAppointments.map((a) => ({
        id: a.id,
        pet: a.pet.name,
        owner: `${a.tutor.name} ${a.tutor.lastName}`,
        time: a.time,
        service: a.service.label,
        status: a.status,
      })),
      alerts: triageAlerts.map((t) => ({
        id: t.id,
        pet: t.pet.name,
        owner: `${t.tutor.name} ${t.tutor.lastName}`,
        urgency: t.urgency,
        symptoms: t.symptoms,
        time: t.createdAt.toISOString(),
      })),
    };
  }

  @Get('patients')
  async getPatients() {
    const pets = await this.prisma.pet.findMany({
      include: {
        tutor: { select: { name: true, lastName: true } },
        medicalRecords: { orderBy: { date: 'desc' }, take: 1 }
      },
      orderBy: { name: 'asc' }
    });

    return pets.map(p => ({
      id: p.id,
      pet: p.name,
      species: p.species,
      breed: p.breed,
      owner: `${p.tutor.name} ${p.tutor.lastName}`,
      lastVisit: p.medicalRecords[0]?.date.toISOString().split('T')[0] || 'Sin consultas'
    }));
  }

  @Get('patients/:id')
  async getPatientById(@Param('id') id: string) {
    const pet = await this.prisma.pet.findUnique({
      where: { id },
      include: {
        tutor: true,
        vaccines: { orderBy: { date: 'desc' } },
        medicalRecords: { orderBy: { date: 'desc' } },
      },
    });

    if (!pet) return null;

    const hoy = new Date();
    const edad = hoy.getFullYear() - pet.birthDate.getFullYear();

    return {
      name: pet.name,
      breed: pet.breed,
      sex: pet.sex,
      age: `${edad} años`,
      weight: `${pet.weightKg} kg`,
      owner: `${pet.tutor.name} ${pet.tutor.lastName}`,
      phone: pet.tutor.phone,
      history: pet.medicalRecords.map((r) => ({
        date: r.date.toISOString(),
        symptoms: r.symptoms,
        diagnosis: r.diagnosis,
        treatment: r.treatment,
      })),
      vaccines: pet.vaccines.map((v) => ({
        id: v.id,
        name: v.name,
        date: v.date.toISOString(),
        next: v.nextDose.toISOString(),
        status: v.status,
      })),
    };
  }

  @Get('appointments')
  async getAppointments(@CurrentUser('id') doctorId: string, @Query('range') range?: string) {
    const where: any = { doctorId };

    if (range === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      where.date = { gte: today, lt: tomorrow };
    }

    const appointments = await this.prisma.appointment.findMany({
      where,
      include: { pet: true, tutor: true, service: true },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    });

    return appointments.map((a) => ({
      id: a.id,
      pet: a.pet.name,
      owner: `${a.tutor.name} ${a.tutor.lastName}`,
      time: a.time,
      date: a.date.toISOString().split('T')[0],
      service: a.service.label,
      status: a.status,
    }));
  }

  @Get('appointments/:id')
  async getAppointmentById(@Param('id') id: string) {
    return await this.prisma.appointment.findUnique({ where: { id } });
  }

  @Patch('appointments/:id/status')
  async updateAppointmentStatus(@Param('id') id: string, @Body('status') status: string) {
    return await this.prisma.appointment.update({
      where: { id },
      data: { status: status as any },
    });
  }

  @Get('triage/alerts')
  async getTriageAlerts() {
    const alerts = await this.prisma.triageReport.findMany({
      where: { status: 'PENDIENTE' },
      include: { pet: true, tutor: true },
      orderBy: [
        { urgency: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return alerts.map((t) => ({
      id: t.id,
      pet: t.pet.name,
      owner: `${t.tutor.name} ${t.tutor.lastName}`,
      urgency: t.urgency,
      symptoms: t.symptoms,
      time: t.createdAt.toISOString(),
    }));
  }

  @Patch('triage/:id/attend')
  async attendTriage(@Param('id') id: string) {
    return await this.prisma.triageReport.update({
      where: { id },
      data: { status: 'ATENDIDO' },
    });
  }

  @Post('consultations')
  async createConsultation(@Body() data: any) {
    return await this.prisma.medicalRecord.create({ data });
  }

  @Get('prescriptions')
  async listPrescriptions(@CurrentUser('id') doctorId: string) {
    const prescriptions = await this.prisma.prescription.findMany({
      where: { doctorId },
      include: {
        pet: { include: { tutor: true } },
      },
      orderBy: { date: 'desc' },
    });

    return prescriptions.map((p) => ({
      id: p.id,
      pet: p.pet.name,
      owner: `${p.pet.tutor.name} ${p.pet.tutor.lastName}`,
      date: p.date.toISOString(),
      text: p.originalText,
      status: p.status,
    }));
  }

  @Post('prescriptions')
  async createPrescription(@Body() data: any) {
    return await this.prisma.prescription.create({ data });
  }

  @Post('prescriptions/:id/interpret')
  async interpretPrescription(@Param('id') id: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
    });

    if (!prescription) return null;

    const aiInterpretation = {
      medications: [
        {
          name: 'Medicamento recetado',
          dosage: 'Según indicación médica',
          duration: 'Según indicación médica',
          administration: 'Vía oral',
          sideEffects: 'Consultar con el veterinario',
        },
      ],
      care: {
        diet: 'Mantener alimentación balanceada',
        activity: 'Reposo relativo',
        hydration: 'Agua fresca siempre disponible',
        followUp: 'Regresar a consulta si no hay mejora en 48h',
      },
      warningSigns: [
        'Vómitos persistentes',
        'Falta de apetito por más de 24h',
        'Decaimiento extremo',
      ],
    };

    await this.prisma.prescription.update({
      where: { id },
      data: {
        aiInterpretation: aiInterpretation as any,
        status: 'INTERPRETADA',
      },
    });

    return {
      petName: undefined,
      date: prescription.date.toISOString(),
      status: 'INTERPRETADA',
      originalText: prescription.originalText,
      aiInterpretation,
    };
  }
}
