import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { ManageHospitalModule } from './manage_hospital/manage_hospital.module';
import { PrismaModule } from './prisma/prisma.module';
import { PatientcareModule } from './patientcare/patientcare.module';
import { AppointmentModule } from './appointment/appointment.module';
import { ConsultationModule } from './consultation/consultation.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ScheduleModule } from '@nestjs/schedule';
import { WhatsappModule } from './common/whatsapp/whatsapp.module';
import { MailerModule } from './common/mailer/mailer.module';

@Module({
  imports: [
    // ✅ Static module for serving uploads
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'), // ✅ This resolves correctly at runtime
      serveRoot: '/uploads',
    }),

    // ✅ Schedule module (must be here for cron jobs to work)
    ScheduleModule.forRoot(),

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'apps/lightningq-api/.env'],
    }),
    AuthModule,
    UserModule,
    AdminModule,
    ManageHospitalModule,
    PrismaModule,
    PatientcareModule,
    AppointmentModule,
    ConsultationModule,
    DashboardModule,
    WhatsappModule,
    MailerModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
