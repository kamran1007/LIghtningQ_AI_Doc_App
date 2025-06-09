import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ManageHospitalService } from 'src/manage_hospital/manage_hospital.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaModule], // PrismaService available
  providers: [AdminService, ManageHospitalService,UserService,PrismaService],
  controllers: [AdminController]
})
export class AdminModule {}
