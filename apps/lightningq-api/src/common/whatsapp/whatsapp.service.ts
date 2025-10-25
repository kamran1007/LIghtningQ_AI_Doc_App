import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private readonly token = process.env.WHATSAPP_TOKEN;
  private readonly phoneNumberId = process.env.PHONE_NUMBER_ID;
  private readonly url = `https://graph.facebook.com/v20.0/${this.phoneNumberId}/messages`;

  private normalizeMobile(mobile?: string): string | null {
    if (!mobile) return null;
    const cleaned = mobile.replace(/[\s()-]/g, '');
    return cleaned.startsWith('+') ? cleaned : `+91${cleaned}`; // 🇮🇳 change if needed
  }

  async sendAppointmentConfirmation(data: {
    patient: { firstName: string; lastName?: string; mobile: string };
    appointmentType: string;
    doctorName: string;
    appointmentDate: string;
    appointmentTime: string;
    hospitalName: string;
    hospitalContact: string;
  }) {
    const to = this.normalizeMobile(data.patient.mobile);
    if (!to) return;

    const body = {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: 'lightningqapointmentbooking', // 👈 must match Meta template name
        language: { code: 'en' },
        components: [
          {
            type: 'header',
            parameters: [
              { type: 'text', text: data.patient.firstName },
              { type: 'text', text: data.patient.lastName ?? '' },
            ],
          },
          {
            type: 'body',
            parameters: [
              { type: 'text', text: data.appointmentType ?? 'FollowUp' },
              { type: 'text', text: data.doctorName },
              { type: 'text', text: data.appointmentTime },
              { type: 'text', text: data.appointmentDate },
              { type: 'text', text: data.hospitalName },
              { type: 'text', text: data.hospitalContact },
            ],
          },
        ],
      },
    };

    try {
      const res = await axios.post(this.url, body, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });
      this.logger.log(`✅ WhatsApp sent: ${JSON.stringify(res.data)}`);
    } catch (err: any) {
      this.logger.error(
        `❌ WhatsApp send failed: ${
          err.response?.data?.error?.message || err.message
        }`,
      );
    }
  }
}
