// src/common/mailer/mailer.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    port: 587,
    secure: false, // Use true for port 465 with SSL
    auth: {
      user: 'resend',
      pass: process.env.RESEND_API_KEY,
    },
  });

  async sendMail(to: string, subject: string, html: string) {
    return await this.transporter.sendMail({
      from: `"LightningQ" <no-reply@lightningq.com>`,
      to,
      subject,
      html,
    });
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
    return await this.transporter.sendMail({
      from: `"LightningQ" <no-reply@lightningq.com>`,
      to,
      subject,
      html,
      attachments,
    });
  }
}
