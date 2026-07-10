import { Injectable, OnModuleInit } from '@nestjs/common';
import * as cron from 'node-cron';
import { AppointmentReminderJob } from './AppointmentReminderJob';

@Injectable()
export class CronScheduler implements OnModuleInit {
  constructor(private readonly appointmentReminderJob: AppointmentReminderJob) {}

  onModuleInit() {
    cron.schedule('0 8 * * *', async () => {
      await this.appointmentReminderJob.execute();
    });
  }
}
