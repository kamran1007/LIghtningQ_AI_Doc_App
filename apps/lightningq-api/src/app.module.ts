import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { LocalAuthGuard } from './auth/guards/local-auth/local-auth.guard';
import { AdminModule } from './admin/admin.module';
import { ManageHospitalModule } from './manage_hospital/manage_hospital.module';
import { PrismaModule } from './prisma/prisma.module';
import { PatientcareModule } from './patientcare/patientcare.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.env', // looks in apps/lightningq-api/.env
      envFilePath: ['.env', 'apps/lightningq-api/.env'], // add paths as needed

    }),
    AuthModule,
    UserModule,
    AdminModule,
    ManageHospitalModule,
    PrismaModule,
    PatientcareModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
