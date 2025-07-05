import { Module } from '@nestjs/common';
import { PatientcareService } from './patientcare.service';
import { PatientcareController } from './patientcare.controller';
import { ManagePatientService } from 'src/manage-patient/manage-patient.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaModule], // PrismaService available
  providers: [PatientcareService,ManagePatientService,PrismaService],
  controllers: [PatientcareController]
})
export class PatientcareModule {}
