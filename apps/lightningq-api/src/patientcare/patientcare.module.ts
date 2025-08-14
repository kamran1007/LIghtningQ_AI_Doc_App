import { Module } from '@nestjs/common';
import { PatientcareService } from './patientcare.service';
import { PatientcareController } from './patientcare.controller';
import { ManagePatientService } from 'src/manage-patient/manage-patient.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppointmentService } from 'src/appointment/appointment.service';
import { MailerService } from 'src/common/mailer/mailer.service';
import { ConsultationService } from 'src/consultation/consultation.service';
import { DashboardService } from 'src/dashboard/dashboard.service';

@Module({
  imports: [PrismaModule], // PrismaService available
  providers: [PatientcareService,ManagePatientService, AppointmentService ,PrismaService,MailerService,ConsultationService,DashboardService],
  controllers: [PatientcareController]
})
export class PatientcareModule {}
