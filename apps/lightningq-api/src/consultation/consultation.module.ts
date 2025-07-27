import { Module } from '@nestjs/common';
import { ConsultationService } from './consultation.service';
import { ConsultationController } from './consultation.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/common/mailer/mailer.service';

@Module({
  providers: [ConsultationService,PrismaService,MailerService],
  controllers: [ConsultationController]
})
export class ConsultationModule {}
