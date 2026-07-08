import { Controller, Get, Post, Body, Param, Patch, Query, UseGuards, Inject } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/JwtAuthGuard';
import { RolesGuard, Roles } from '../auth/RolesGuard';
import { Role } from '@prisma/client';
import { PrismaService } from '../../../out/persistence/PrismaService';
import { CurrentUser } from '../auth/CurrentUser';
import type { IAiService } from '../../../../../domain/ports/out/ai/IAiService';

@Controller('doctor')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.DOCTOR)
export class DoctorController {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('IAiService') private readonly aiService: IAiService,
  ) {}

  @Get('dashboard')
  async getDashboard(@CurrentUser('id') doctorId: string) {
    const inicio = new Date();
    inicio.setHours(0, 0, 0, 0);
    const fin = new Date();
    fin.setHours(23, 59, 59, 999);

    const [appointments, patientCount, triageAlerts] = await Promise.all([
      this.prisma.appointment.findMany({
        where: { 
          doctorId, 
          date: { gte: inicio, lte: fin },
          status: { in: ['PROGRAMADA', 'EN_CURSO'] } 
        },
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
      todayAppointments: appointments.length,
      patientCount,
      triageAlerts: triageAlerts.length,
      emergencies: triageAlerts.filter((t) => t.urgency === 'CRITICA').length,
      appointments: appointments.map((a) => ({
        id: a.id,
        pet: a.pet.name,
        owner: `${a.tutor.name} ${a.tutor.lastName}`,
        time: a.time,
        date: a.date.toISOString().split('T')[0],
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
        id: r.id,
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
      const inicio = new Date();
      inicio.setHours(0, 0, 0, 0);
      const fin = new Date();
      fin.setHours(23, 59, 59, 999);
      where.date = { gte: inicio, lte: fin };
    }

    const appointments = await this.prisma.appointment.findMany({
      where,
      include: { pet: true, tutor: true, service: true },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    });

    return appointments.map((a) => ({
      id: a.id,
      petId: a.pet.id,
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
    return await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        pet: true,
        tutor: { select: { name: true, lastName: true, phone: true } },
        service: true,
      },
    });
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
  async createConsultation(@CurrentUser('id') doctorId: string, @Body() data: any) {
    return await this.prisma.medicalRecord.create({
      data: {
        petId: data.petId,
        doctorId,
        reason: data.reason || '',
        symptoms: data.symptoms,
        diagnosis: data.diagnosis,
        treatment: data.treatment,
      },
    });
  }

  @Get('consultations/:id')
  async getConsultation(@Param('id') id: string) {
    return await this.prisma.medicalRecord.findUnique({
      where: { id },
      include: {
        pet: true,
        doctor: { select: { name: true, lastName: true } },
        prescriptions: true,
      },
    });
  }

  @Patch('consultations/:id')
  async updateConsultation(@Param('id') id: string, @Body() data: any) {
    return await this.prisma.medicalRecord.update({
      where: { id },
      data,
    });
  }

  @Post('consultations/analyze-transcript')
  async analyzeTranscript(@Body() body: { transcript: string; appointmentReason?: string }) {
    return await this.aiService.analyzeTranscript(body.transcript, body.appointmentReason);
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

  @Get('prescriptions/:id')
  async getPrescription(@Param('id') id: string) {
    const p = await this.prisma.prescription.findUnique({
      where: { id },
      include: { pet: { include: { tutor: true } } },
    });
    if (!p) return null;
    return {
      id: p.id,
      pet: p.pet.name,
      owner: `${p.pet.tutor.name} ${p.pet.tutor.lastName}`,
      date: p.date.toISOString(),
      originalText: p.originalText,
      status: p.status,
      aiInterpretation: p.aiInterpretation,
    };
  }

  @Post('prescriptions')
  async createPrescription(@CurrentUser('id') doctorId: string, @Body() data: any) {
    return await this.prisma.prescription.create({
      data: {
        petId: data.petId,
        doctorId,
        medicalRecordId: data.medicalRecordId,
        originalText: data.originalText,
      },
    });
  }

  @Post('prescriptions/:id/interpret')
  async interpretPrescription(@Param('id') id: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
    });

    if (!prescription) return null;

    const aiInterpretation = await this.aiService.interpretPrescription(prescription.originalText);

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