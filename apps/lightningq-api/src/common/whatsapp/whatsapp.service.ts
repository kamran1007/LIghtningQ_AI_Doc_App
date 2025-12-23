// import { Injectable, Logger } from '@nestjs/common';
// import axios from 'axios';

// @Injectable()
// export class WhatsappService {
//   private readonly logger = new Logger(WhatsappService.name);
//   private readonly token = process.env.WHATSAPP_TOKEN;
//   private readonly phoneNumberId = process.env.PHONE_NUMBER_ID;
//   private readonly url = `https://graph.facebook.com/v20.0/${this.phoneNumberId}/messages`;

//   constructor() {
//     this.logger.log('🚀 WhatsAppService initialized...');
//     this.logger.log(`📞 PHONE_NUMBER_ID: ${this.phoneNumberId || '❌ Undefined'}`);
//     this.logger.log(`🔑 TOKEN: ${this.token ? '✅ Loaded' : '❌ Missing'}`);
//     this.logger.log(`🌐 API URL: ${this.url}`);
//   }

//   private normalizeMobile(mobile?: string): string | null {
//     if (!mobile) {
//       this.logger.warn('⚠️ No mobile number provided to normalizeMobile()');
//       return null;
//     }

//     const cleaned = mobile.replace(/[\s()-]/g, '');
//     const normalized = cleaned.startsWith('+') ? cleaned : `+91${cleaned}`;
//     this.logger.log(`📱 Normalized mobile number: ${normalized}`);
//     return normalized;
//   }

//   async sendAppointmentConfirmation(data: {
//     patient: { firstName: string; lastName?: string; mobile: string };
//     appointmentType: string;
//     doctorName: string;
//     appointmentDate: string;
//     appointmentTime: string;
//     hospitalName: string;
//     hospitalContact: string;
//   }) {
//     this.logger.log('🧩 Preparing WhatsApp confirmation message...');
//     this.logger.debug(`🧾 Payload Input: ${JSON.stringify(data, null, 2)}`);

//     const to = this.normalizeMobile(data.patient.mobile);
//     if (!to) {
//       this.logger.error('❌ WhatsApp send aborted — invalid or missing mobile number.');
//       return;
//     }

//     const body = {
//       messaging_product: 'whatsapp',
//       to,
//       type: 'template',
//       template: {
//         name: 'lightningqapointmentbooking', // your template name in Meta dashboard
//         language: { code: 'en' },
//         components: [
//           {
//             type: 'header',
//             parameters: [
//               {
//                 type: 'text',
//                 text: `${data.patient.firstName} ${data.patient.lastName ?? ''}`.trim(),
//               },
//             ],
//           },
//           {
//             type: 'body',
//             parameters: [
//               { type: 'text', text: data.appointmentType ?? 'FollowUp' }, // {{1}}
//               { type: 'text', text: data.doctorName }, // {{2}}
//               { type: 'text', text: data.hospitalName }, // {{3}}
//               { type: 'text', text: data.appointmentDate }, // {{4}}
//               { type: 'text', text: data.appointmentTime }, // {{5}}
//               { type: 'text', text: data.hospitalContact }, // {{6}}
//             ],
//           },
//         ],
//       },
//     };

//     this.logger.debug(`📤 WhatsApp API URL: ${this.url}`);
//     this.logger.debug(`📦 WhatsApp Payload: ${JSON.stringify(body, null, 2)}`);

//     try {
//       const res = await axios.post(this.url, body, {
//         headers: {
//           Authorization: `Bearer ${this.token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       this.logger.log(`✅ WhatsApp sent successfully!`);
//       this.logger.debug(`📨 API Response: ${JSON.stringify(res.data, null, 2)}`);
//     } catch (err: any) {
//       this.logger.error('❌ WhatsApp API Request Failed:');
//       this.logger.error(`🧩 URL Used: ${this.url}`);
//       this.logger.error(`📞 PHONE_NUMBER_ID: ${this.phoneNumberId}`);
//       this.logger.error(`🔑 Token Present: ${!!this.token}`);
//       this.logger.error(
//         `🧾 Error Response: ${JSON.stringify(err.response?.data || err.message, null, 2)}`
//       );
//     }
//   }
// }

import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  // MSG91 Config
  private readonly msg91AuthKey = process.env.WHATSAPP_AUTHKEY;
  private readonly msg91BaseUrl =
    'https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/';
  private readonly integratedNumber = '15558282551'; // your MSG91 integrated number
  private readonly templateName = 'lightningqappointmentbooking2'; // template name created in MSG91
  private readonly namespace = '55f1a1a8_5bf1_4ed7_8e86_c3e257969b15'; // template namespace

  constructor() {
    this.logger.log('🚀 WhatsAppService (MSG91) initialized...');
    this.logger.log(
      `🔑 MSG91 AuthKey: ${this.msg91AuthKey ? '✅ Loaded' : '❌ Missing'}`,
    );
  }

  private normalizeMobile(mobile?: string): string | null {
    if (!mobile) return null;

    const cleaned = mobile.replace(/[\s()-]/g, '');
    if (cleaned.startsWith('91')) return cleaned;
    if (cleaned.startsWith('+91')) return cleaned.replace('+', '');
    return `91${cleaned}`;
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
    this.logger.log('🧩 Preparing MSG91 WhatsApp message...');
    this.logger.debug(`Payload Input: ${JSON.stringify(data, null, 2)}`);

    const mobile = this.normalizeMobile(data.patient.mobile);
    if (!mobile) {
      this.logger.error('❌ Invalid or missing mobile number.');
      return;
    }

    // 🔹 Normalize appointment type
    let appointmentTypeLabel = data.appointmentType;

    if (
      appointmentTypeLabel === 'Paid Follow-up' ||
      appointmentTypeLabel === 'Free Follow-up'
    ) {
      appointmentTypeLabel = `${appointmentTypeLabel} Appointment`;
    }

    // 🔧 Build MSG91 Payload
    const body = {
      integrated_number: this.integratedNumber,
      content_type: 'template',
      payload: {
        messaging_product: 'whatsapp',
        type: 'template',
        template: {
          name: this.templateName,
          language: {
            code: 'en',
            policy: 'deterministic',
          },
          namespace: this.namespace,
          to_and_components: [
            {
              to: [mobile],
              components: {
                header_1: {
                  type: 'text',
                  value: `${data.patient.firstName} ${data.patient.lastName ?? ''}`,
                },
                body_1: { type: 'text', value: appointmentTypeLabel },
                body_2: { type: 'text', value: data.doctorName },
                body_3: { type: 'text', value: data.hospitalName },
                body_4: { type: 'text', value: data.appointmentDate },
                body_5: { type: 'text', value: data.appointmentTime },
                body_6: { type: 'text', value: data.hospitalContact },
              },
            },
          ],
        },
      },
    };

    this.logger.debug(`📦 MSG91 Payload: ${JSON.stringify(body, null, 2)}`);

    try {
      const res = await axios.post(this.msg91BaseUrl, body, {
        headers: {
          'Content-Type': 'application/json',
          authkey: this.msg91AuthKey,
        },
      });

      this.logger.log('✅ WhatsApp (MSG91) message sent successfully!');
      this.logger.debug(`📨 Response: ${JSON.stringify(res.data, null, 2)}`);
    } catch (err: any) {
      this.logger.error('❌ MSG91 API Request Failed');
      this.logger.error(
        `🧾 Error Response: ${JSON.stringify(err.response?.data || err.message, null, 2)}`,
      );
    }
  }

  async sendFollowupReminder(data: {
    mobile: string;
    patientName: string;
    doctorName: string;
    followupDate: Date;
    hospitalName: string;
  }) {
    this.logger.log('📨 Sending WhatsApp follow-up reminder');

    const mobile = this.normalizeMobile(data.mobile);
    if (!mobile) {
      this.logger.error('❌ Invalid mobile number');
      return;
    }

    const followupDateStr = new Date(data.followupDate).toLocaleDateString(
      'en',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Kolkata',
      },
    );

    const body = {
      integrated_number: this.integratedNumber,
      content_type: 'template',
      payload: {
        messaging_product: 'whatsapp',
        type: 'template',
        template: {
          name: 'lightningq_followup_reminder',
          language: {
            code: 'en',
            policy: 'deterministic',
          },
          namespace: this.namespace,
          to_and_components: [
            {
              to: [mobile],
              components: {
                // ✅ HEADER VARIABLE ({{1}})
                header_1: {
                  type: 'text',
                  value: data.patientName,
                },

                // ✅ BODY VARIABLES ({{1}}, {{2}}, {{3}})
                body_1: {
                  type: 'text',
                  value: data.doctorName,
                },
                body_2: {
                  type: 'text',
                  value: followupDateStr,
                },
                body_3: {
                  type: 'text',
                  value: data.hospitalName,
                },
              },
            },
          ],
        },
      },
    };

    this.logger.debug(`📦 Follow-up Payload: ${JSON.stringify(body, null, 2)}`);

    try {
      const res = await axios.post(this.msg91BaseUrl, body, {
        headers: {
          'Content-Type': 'application/json',
          authkey: this.msg91AuthKey,
        },
      });

      this.logger.log('✅ Follow-up WhatsApp reminder sent');
      this.logger.debug(`📨 Response: ${JSON.stringify(res.data, null, 2)}`);
    } catch (err: any) {
      this.logger.error('❌ Failed to send follow-up reminder');
      this.logger.error(
        JSON.stringify(err.response?.data || err.message, null, 2),
      );
    }
  }
}
