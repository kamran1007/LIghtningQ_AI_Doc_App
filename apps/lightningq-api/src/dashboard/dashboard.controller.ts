// apps/api/src/dashboard/dashboard.controller.ts
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Patch,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateScheduledReportDto } from './dto/CreateSchedule.dto';
import { calculateNextRun } from 'src/utils/scheduler.util';
import { UpdateScheduledReportDto } from './dto/UpdateScheduled.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('Dashboardsummary')
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

  @Get('AdvancedReport')
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
          : calculateNextRun(dto.frequency),
      },
    });
  }
  
  @Patch('UpdateReportSchedular/:ScheduledReportId')
  async updateScheduledReport(
    @Param('ScheduledReportId') ScheduledReportId: number,
    @Body() dto: UpdateScheduledReportDto,
  ) {
    const scheduled = await this.prisma.scheduledReport.findUnique({
      where: { ScheduledReportId: Number(ScheduledReportId) },
    });

    if (!scheduled) {
      throw new NotFoundException('Scheduled report not found');
    }

    return this.prisma.scheduledReport.update({
      where: { ScheduledReportId: Number(ScheduledReportId) },
      data: {
        frequency: dto.frequency ?? scheduled.frequency,
        reportTypes: dto.reportTypes ?? scheduled.reportTypes,
        nextRunAt: dto.nextRunAt
          ? new Date(dto.nextRunAt)
          : scheduled.nextRunAt,
      },
    });
  }

  @Get('getReportsSchedular')
  async getReports(
    @Query('adminId') adminId: string,
    @Query('hospitalId') hospitalId: string,
  ) {
    const reports = await this.dashboardService.getReportsSchedularByAdminHospital(
      Number(adminId),
      Number(hospitalId),
    );

    return {
      reports,
    };
  }




  @Get('getAllHospital')
  async getAllHospital() {
    return this.dashboardService.getAllHospital();
  }
}
