import { Module } from '@nestjs/common';
import { ManageHospitalService } from './manage_hospital.service';
import { ManageHospitalController } from './manage_hospital.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ManageHospitalService,PrismaService],
  controllers: [ManageHospitalController]
})
export class ManageHospitalModule {}
