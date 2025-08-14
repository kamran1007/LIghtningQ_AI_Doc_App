import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/common/mailer/mailer.service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, PrismaService, MailerService],
})
export class DashboardModule {}
