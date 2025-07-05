import { Module } from '@nestjs/common';
import { ManagePatientService } from './manage-patient.service';
import { ManagePatientController } from './manage-patient.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ManagePatientService,PrismaService],
  controllers: [ManagePatientController]
})
export class ManagePatientModule {}
