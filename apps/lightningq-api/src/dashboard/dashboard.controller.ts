// apps/api/src/dashboard/dashboard.controller.ts
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateScheduledReportDto } from './dto/CreateSchedule.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('summary')
  async getDashboardSummary(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('hospitalId') hospitalId?: number,
    @Query('doctorId') doctorId?: number,
  ) {
    return this.dashboardService.getDashboardSummary({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      hospitalId,
      doctorId,
    });
  }

  @Get('PatientDemographics')
  async getPatientDemographics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('hospitalId') hospitalId?: number,
    @Query('doctorId') doctorId?: number,
  ) {
    return this.dashboardService.getPatientDemographics({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      hospitalId,
      doctorId,
    });
  }

  @Get('advanced-report')
  async getAdvancedReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('doctorId') doctorId?: string,
    @Query('hospitalId') hospitalId?: string,
    @Query('specializationId') specializationId?: string,
  ) {
    return this.dashboardService.getAdvancedReport({
      startDate,
      endDate,
      doctorId: doctorId ? Number(doctorId) : undefined,
      hospitalId: hospitalId ? Number(hospitalId) : undefined,
      specializationId: specializationId ? Number(specializationId) : undefined,
    });
  }
  @Post('ReportSchedular')
  async createScheduledReport(@Body() dto: CreateScheduledReportDto) {
    // Step 1 — Run the cron logic immediately before scheduling a new one
    await this.dashboardService.checkAndSendReports();

    // Step 2 — Create new scheduled report
    return this.prisma.scheduledReport.create({
      data: {
        HospitalId: dto.hospitalId,
        adminId: dto.adminId,
        frequency: dto.frequency,
        reportTypes: dto.reportTypes,
        nextRunAt: dto.nextRunAt
          ? new Date(dto.nextRunAt)
          : this.calculateNextRun(dto.frequency),
      },
    });
  }

  private calculateNextRun(frequency: string): Date {
    const now = new Date();
    if (frequency === 'Weekly') {
      now.setDate(now.getDate() + (7 - now.getDay())); // next Monday
    } else {
      now.setMonth(now.getMonth() + 1, 1); // first day of next month
    }
    return now;
  }
}
