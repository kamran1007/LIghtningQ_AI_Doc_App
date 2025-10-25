import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/common/mailer/mailer.service';
import { WhatsappService } from 'src/common/whatsapp/whatsapp.service';
import { WhatsappModule } from 'src/common/whatsapp/whatsapp.module';

@Module({
  imports: [WhatsappModule], // 👈 Add MailerModule
  providers: [
    AppointmentService,
    PrismaService,
    MailerService,
    WhatsappService,
  ],
  controllers: [AppointmentController],
})
export class AppointmentModule {}
