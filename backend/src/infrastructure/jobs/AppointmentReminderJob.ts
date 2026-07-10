import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../adapters/out/persistence/PrismaService';

@Injectable()
export class AppointmentReminderJob {
  private readonly logger = new Logger(AppointmentReminderJob.name);

  constructor(private readonly prisma: PrismaService) {}

  async execute() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const endOfTomorrow = new Date(tomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        date: { gte: tomorrow, lte: endOfTomorrow },
        status: 'PROGRAMADA',
      },
      include: {
        tutor: true,
        pet: true,
      },
    });

    for (const apt of appointments) {
      this.logger.log(`Recordatorio enviado a ${apt.tutor.name} para la cita de ${apt.pet.name} mañana a las ${apt.time}`);
    }
    
    return appointments.length;
  }
}