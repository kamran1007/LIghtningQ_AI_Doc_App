// src/common/mailer/mailer.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use true for port 465 with SSL
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendMail(to: string, subject: string, html: string) {
    return await this.transporter.sendMail({
      from: `"LightningQ" <${process.env.SMTP_USER}>`,
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
      from: `"LightningQ" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      attachments,
    });
  }
}
