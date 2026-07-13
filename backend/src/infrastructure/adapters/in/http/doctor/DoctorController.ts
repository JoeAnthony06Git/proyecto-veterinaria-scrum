import { Controller, Get, Post, Body, Param, Patch, Query, UseGuards, Inject } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/JwtAuthGuard';
import { RolesGuard, Roles } from '../auth/RolesGuard';
import { Role } from '@prisma/client';
import { PrismaService } from '../../../out/persistence/PrismaService';
import { CurrentUser } from '../auth/CurrentUser';
import type { IAiService } from '../../../../../domain/ports/out/ai/IAiService';
import { EmailService } from '../../../../services/email.service';

@Controller('doctor')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.DOCTOR)
export class DoctorController {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('IAiService') private readonly aiService: IAiService,
    private readonly emailService: EmailService,
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
  async getAppointments(
    @CurrentUser('id') doctorId: string, 
    @Query('range') range?: string,
    @Query('date') dateParam?: string
  ) {
    const where: any = { doctorId };

    if (dateParam) {
      const targetDate = new Date(dateParam + 'T00:00:00Z');
      const nextDay = new Date(targetDate);
      nextDay.setDate(targetDate.getDate() + 1);
      where.date = { gte: targetDate, lt: nextDay };
    } else if (range === 'today') {
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
      include: {
        pet: { include: { tutor: true } },
        doctor: true,
      },
    });
    if (!p) return null;
    return {
      id: p.id,
      pet: p.pet.name,
      owner: `${p.pet.tutor.name} ${p.pet.tutor.lastName}`,
      doctorName: `Dr. ${p.doctor.name} ${p.doctor.lastName}`,
      date: p.date.toISOString(),
      originalText: p.originalText,
      status: p.status,
      aiInterpretation: p.aiInterpretation,
    };
  }

  @Post('prescriptions')
  async createPrescription(@CurrentUser('id') doctorId: string, @Body() data: any) {
    const prescription = await this.prisma.prescription.create({
      data: {
        petId: data.petId,
        doctorId,
        medicalRecordId: data.medicalRecordId,
        originalText: data.originalText,
      },
    });

    let emailStatus = 'no_intentado';
    try {
      const sent = await this.sendPrescriptionEmail(prescription.id);
      emailStatus = sent ? 'enviado' : 'fallo';
    } catch (err) {
      emailStatus = 'error';
    }

    return { ...prescription, emailStatus };
  }

  @Get('prescriptions/:id/email')
  async resendPrescriptionEmail(@Param('id') id: string) {
    try {
      await this.sendPrescriptionEmail(id);
      return { message: 'Email enviado correctamente' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      return { message: 'Error al enviar email', error: errorMessage };
    }
  }

  @Get('prescriptions/:id/email-html')
  async getPrescriptionEmailHtml(@Param('id') id: string) {
    const html = await this.buildPrescriptionEmailHtml(id);
    return { html };
  }

  private async buildPrescriptionEmailHtml(prescriptionId: string): Promise<string> {
    const params = await this.getPrescriptionEmailParams(prescriptionId);
    if (!params) return '';
    return this.emailService.getEmailHtml(params);
  }

  private async getPrescriptionEmailParams(prescriptionId: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id: prescriptionId },
      include: {
        doctor: { include: { doctorInfo: true } },
        pet: { include: { tutor: true } },
        medicalRecord: true,
      },
    });
    if (!prescription?.pet?.tutor?.email || !prescription.doctor) return null;

    const ai = prescription.aiInterpretation as any;
    let medicationsHtml = '', careHtml = '', warningHtml = '';

    if (ai) {
      if (ai.medications?.length) {
        medicationsHtml = ai.medications.map((m: any) =>
          `<p style="margin:2px 0;">\u2022 <strong>${m.name}</strong> &mdash; ${m.dosage} &mdash; ${m.administration}${m.duration ? ` &mdash; ${m.duration}` : ''}</p>`
        ).join('');
      }
      if (ai.care) {
        const items: string[] = [];
        if (ai.care.diet) items.push(`Alimentaci\u00F3n: ${ai.care.diet}`);
        if (ai.care.hydration) items.push(`Hidrataci\u00F3n: ${ai.care.hydration}`);
        if (ai.care.activity) items.push(`Actividad: ${ai.care.activity}`);
        if (ai.care.followUp) items.push(`Seguimiento: ${ai.care.followUp}`);
        careHtml = items.map(i => `<p style="margin:2px 0;">\u2022 ${i}</p>`).join('');
      }
      if (ai.warningSigns?.length) {
        warningHtml = ai.warningSigns.map((s: string) =>
          `<p style="margin:2px 0;">\u26A0 ${s}</p>`
        ).join('');
      }
    }

    return {
      to: prescription.pet.tutor.email,
      tutorName: `${prescription.pet.tutor.name} ${prescription.pet.tutor.lastName}`,
      petName: prescription.pet.name,
      doctorName: `${prescription.doctor.name} ${prescription.doctor.lastName}`,
      doctorSpecialty: (prescription.doctor as any)?.doctorInfo?.specialty || 'Medicina General',
      date: prescription.date.toISOString().split('T')[0],
      symptoms: prescription.medicalRecord?.symptoms || '',
      diagnosis: prescription.medicalRecord?.diagnosis || '',
      treatment: prescription.medicalRecord?.treatment || '',
      prescriptionId: prescription.id,
      originalText: prescription.originalText,
      medications: medicationsHtml || undefined,
      care: careHtml || undefined,
      warningSigns: warningHtml || undefined,
    };
  }

  private async sendPrescriptionEmail(prescriptionId: string): Promise<boolean> {
    const params = await this.getPrescriptionEmailParams(prescriptionId);
    if (!params) return false;
    return await this.emailService.sendPrescriptionEmail(params);
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
