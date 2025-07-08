import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/common/mailer/mailer.service';

@Module({
  providers: [AppointmentService,PrismaService,MailerService],
  controllers: [AppointmentController]
})
export class AppointmentModule {}
