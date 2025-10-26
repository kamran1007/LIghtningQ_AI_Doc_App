import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private readonly token = process.env.WHATSAPP_TOKEN;
  private readonly phoneNumberId = process.env.PHONE_NUMBER_ID;
  private readonly url = `https://graph.facebook.com/v20.0/${this.phoneNumberId}/messages`;

  constructor() {
    this.logger.log('🚀 WhatsAppService initialized...');
    this.logger.log(`📞 PHONE_NUMBER_ID: ${this.phoneNumberId || '❌ Undefined'}`);
    this.logger.log(`🔑 TOKEN: ${this.token ? '✅ Loaded' : '❌ Missing'}`);
    this.logger.log(`🌐 API URL: ${this.url}`);
  }

  private normalizeMobile(mobile?: string): string | null {
    if (!mobile) {
      this.logger.warn('⚠️ No mobile number provided to normalizeMobile()');
      return null;
    }

    const cleaned = mobile.replace(/[\s()-]/g, '');
    const normalized = cleaned.startsWith('+') ? cleaned : `+91${cleaned}`;
    this.logger.log(`📱 Normalized mobile number: ${normalized}`);
    return normalized;
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
    this.logger.log('🧩 Preparing WhatsApp confirmation message...');
    this.logger.debug(`🧾 Payload Input: ${JSON.stringify(data, null, 2)}`);

    const to = this.normalizeMobile(data.patient.mobile);
    if (!to) {
      this.logger.error('❌ WhatsApp send aborted — invalid or missing mobile number.');
      return;
    }

    const body = {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: 'lightningqapointmentbooking', // your template name in Meta dashboard
        language: { code: 'en' },
        components: [
          {
            type: 'header',
            parameters: [
              {
                type: 'text',
                text: `${data.patient.firstName} ${data.patient.lastName ?? ''}`.trim(),
              },
            ],
          },
          {
            type: 'body',
            parameters: [
              { type: 'text', text: data.appointmentType ?? 'FollowUp' }, // {{1}}
              { type: 'text', text: data.doctorName }, // {{2}}
              { type: 'text', text: data.hospitalName }, // {{3}}
              { type: 'text', text: data.appointmentDate }, // {{4}}
              { type: 'text', text: data.appointmentTime }, // {{5}}
              { type: 'text', text: data.hospitalContact }, // {{6}}
            ],
          },
        ],
      },
    };

    this.logger.debug(`📤 WhatsApp API URL: ${this.url}`);
    this.logger.debug(`📦 WhatsApp Payload: ${JSON.stringify(body, null, 2)}`);

    try {
      const res = await axios.post(this.url, body, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });

      this.logger.log(`✅ WhatsApp sent successfully!`);
      this.logger.debug(`📨 API Response: ${JSON.stringify(res.data, null, 2)}`);
    } catch (err: any) {
      this.logger.error('❌ WhatsApp API Request Failed:');
      this.logger.error(`🧩 URL Used: ${this.url}`);
      this.logger.error(`📞 PHONE_NUMBER_ID: ${this.phoneNumberId}`);
      this.logger.error(`🔑 Token Present: ${!!this.token}`);
      this.logger.error(
        `🧾 Error Response: ${JSON.stringify(err.response?.data || err.message, null, 2)}`
      );
    }
  }
}
