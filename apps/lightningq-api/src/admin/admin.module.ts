import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ManageHospitalService } from 'src/manage_hospital/manage_hospital.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { R2Service } from 'src/r2/r2.service';
import { R2Module } from 'src/r2/r2.module';

@Module({
  imports: [PrismaModule, R2Module],
  providers: [
    AdminService,
    ManageHospitalService,
    UserService,
    PrismaService,
  ],
  controllers: [AdminController],
})
export class AdminModule {}

