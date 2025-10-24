// // src/common/mailer/mailer.service.ts
// import { Injectable } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';

// @Injectable()
// export class MailerService {
//   private transporter = nodemailer.createTransport({
//     host: 'smtp.resend.com',
//     port: 587,
//     secure: false, // Use true for port 465 with SSL
//     auth: {
//       user: 'resend',
//       pass: process.env.RESEND_API_KEY,
//     },
//   });

//   async sendMail(to: string, subject: string, html: string) {
//     return await this.transporter.sendMail({
//       from: `"LightningQ" <no-reply@lightningq.com>`,
//       to,
//       subject,
//       html,
//     });
//   }

//   async sendMailWithAttachment(
//     to: string,
//     subject: string,
//     html: string,
//     attachments: {
//       filename: string;
//       content: Buffer | string;
//       contentType?: string;
//     }[],
//   ) {
//     return await this.transporter.sendMail({
//       from: `"LightningQ" <no-reply@lightningq.com>`,
//       to,
//       subject,
//       html,
//       attachments,
//     });
//   }
// }


// src/common/mailer/mailer.service.ts
import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailerService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      const result = await this.resend.emails.send({
        from: 'LightningQ <no-reply@lightningq.com>',
        to,
        subject,
        html,
      });
      console.log('✅ Email sent via Resend API:', result);
      return result;
    } catch (error) {
      console.error('❌ Email sending failed:', error);
    }
  }

  async sendMailWithAttachment(
    to: string,
    subject: string,
    html: string,
    attachments: {
      filename: string;
      content: Buffer | string;
      contentType?: string;
    }[],
  ) {
    try {
      const result = await this.resend.emails.send({
        from: 'LightningQ <no-reply@lightningq.com>',
        to,
        subject,
        html,
        attachments: attachments.map((att) => ({
          filename: att.filename,
          content: att.content,
          contentType: att.contentType,
        })),
      });
      console.log('✅ Email with attachment sent via Resend API:', result);
      return result;
    } catch (error) {
      console.error('❌ Email with attachment failed:', error);
    }
  }
}
