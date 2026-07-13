import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  get isConfigured(): boolean {
    return !!process.env.RESEND_API_KEY;
  }

  async sendPrescriptionEmail(params: {
    to: string;
    tutorName: string;
    petName: string;
    doctorName: string;
    doctorSpecialty: string;
    date: string;
    symptoms: string;
    diagnosis: string;
    treatment: string;
    prescriptionId: string;
    originalText: string;
    medications?: string;
    care?: string;
    warningSigns?: string;
  }): Promise<boolean> {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY no configurada. Email no enviado.');
      return false;
    }

    const clinicName = process.env.CLINIC_NAME || 'Veterinaria Central';
    const clinicPhone = process.env.CLINIC_PHONE || '';
    const clinicAddress = process.env.CLINIC_ADDRESS || '';

    const html = this.buildEmailHtml({ ...params, clinicName, clinicPhone, clinicAddress });

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'onboarding@resend.dev',
          to: params.to,
          subject: `Receta Médica para ${params.petName} — ${clinicName}`,
          html,
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        this.logger.error(`Resend error (${res.status}): ${body}`);
        return false;
      }

      this.logger.log(`Email enviado a ${params.to} via Resend`);
      return true;
    } catch (error) {
      this.logger.error(`Error al enviar email via Resend: ${error.message}`);
      return false;
    }
  }

  getEmailHtml(params: {
    to: string;
    tutorName: string;
    petName: string;
    doctorName: string;
    doctorSpecialty: string;
    date: string;
    symptoms: string;
    diagnosis: string;
    treatment: string;
    prescriptionId: string;
    originalText: string;
    medications?: string;
    care?: string;
    warningSigns?: string;
  }): string {
    const clinicName = process.env.CLINIC_NAME || 'Veterinaria Central';
    const clinicPhone = process.env.CLINIC_PHONE || '';
    const clinicAddress = process.env.CLINIC_ADDRESS || '';
    return this.buildEmailHtml({ ...params, clinicName, clinicPhone, clinicAddress });
  }

  private buildEmailHtml(params: {
    to: string;
    tutorName: string;
    petName: string;
    doctorName: string;
    doctorSpecialty: string;
    date: string;
    symptoms: string;
    diagnosis: string;
    treatment: string;
    prescriptionId: string;
    originalText: string;
    medications?: string;
    care?: string;
    warningSigns?: string;
    clinicName: string;
    clinicPhone: string;
    clinicAddress: string;
  }): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb;">
        <div style="background: #1e3a5f; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #fff; margin: 0; font-size: 20px;">${params.clinicName}</h1>
        </div>
        <div style="background: #fff; padding: 32px; border: 1px solid #e5e7eb;">
          <h2 style="color: #1e3a5f; font-size: 18px; margin: 0 0 4px; text-align: center;">RECETA M\u00C9DICA</h2>
          <p style="color: #6b7280; font-size: 12px; text-align: center; margin: 0 0 20px;">${params.date} &middot; N\u00B0 ${params.prescriptionId.slice(0, 8).toUpperCase()}</p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
            <tr>
              <td style="background: #eff6ff; padding: 12px; border-radius: 6px; vertical-align: top;">
                <p style="margin: 0 0 4px; font-size: 11px; color: #2563eb; font-weight: bold;">M\u00C9DICO</p>
                <p style="margin: 0; font-size: 14px; color: #111827;">Dr. ${params.doctorName}</p>
                <p style="margin: 2px 0 0; font-size: 12px; color: #6b7280;">${params.doctorSpecialty}</p>
              </td>
              <td style="width: 16px;"></td>
              <td style="background: #ecfdf5; padding: 12px; border-radius: 6px; vertical-align: top;">
                <p style="margin: 0 0 4px; font-size: 11px; color: #059669; font-weight: bold;">PACIENTE</p>
                <p style="margin: 0; font-size: 14px; color: #111827;">${params.petName}</p>
                <p style="margin: 2px 0 0; font-size: 12px; color: #6b7280;">Tutor: ${params.tutorName}</p>
              </td>
            </tr>
          </table>
          <h3 style="color: #1e3a5f; font-size: 14px; margin: 16px 0 8px; border-bottom: 2px solid #e5e7eb; padding-bottom: 4px;">DATOS CL\u00CDNICOS</h3>
          ${params.symptoms ? `<p style="margin: 4px 0; font-size: 13px;"><strong>S\u00EDntomas:</strong> ${params.symptoms}</p>` : ''}
          ${params.diagnosis ? `<p style="margin: 4px 0; font-size: 13px;"><strong>Diagn\u00F3stico:</strong> ${params.diagnosis}</p>` : ''}
          ${params.treatment ? `<p style="margin: 4px 0; font-size: 13px;"><strong>Tratamiento:</strong> ${params.treatment}</p>` : ''}
          <h3 style="color: #1e3a5f; font-size: 14px; margin: 16px 0 8px; border-bottom: 2px solid #e5e7eb; padding-bottom: 4px;">RECETA</h3>
          <div style="background: #f3f4f6; padding: 12px; border-radius: 6px; font-size: 13px; color: #111827; white-space: pre-wrap;">${params.originalText}</div>
          ${params.medications ? `<h3 style="color: #1e3a5f; font-size: 14px; margin: 16px 0 8px; border-bottom: 2px solid #e5e7eb; padding-bottom: 4px;">MEDICAMENTOS</h3><div style="font-size: 13px;">${params.medications}</div>` : ''}
          ${params.care ? `<h3 style="color: #1e3a5f; font-size: 14px; margin: 16px 0 8px; border-bottom: 2px solid #e5e7eb; padding-bottom: 4px;">CUIDADOS</h3><div style="font-size: 13px;">${params.care}</div>` : ''}
          ${params.warningSigns ? `<h3 style="color: #dc2626; font-size: 14px; margin: 16px 0 8px; border-bottom: 2px solid #fca5a5; padding-bottom: 4px;">SE\u00D1ALES DE ALERTA</h3><div style="font-size: 13px; color: #dc2626;">${params.warningSigns}</div>` : ''}
        </div>
        <div style="background: #f3f4f6; padding: 16px; text-align: center; border-radius: 0 0 8px 8px; font-size: 11px; color: #9ca3af;">
          ${params.clinicName}${params.clinicAddress ? ` &mdash; ${params.clinicAddress}` : ''}${params.clinicPhone ? ` &mdash; ${params.clinicPhone}` : ''}
          <br/>Este correo es generado autom\u00E1ticamente.
        </div>
      </div>
    `;
  }
}
