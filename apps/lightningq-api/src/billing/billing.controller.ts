import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateOrUpdateBillingItemChargeDto } from './dto/create-billing-item-charge.dto';
import { CreatePatientPackageUsageDto } from './dto/create-patient-package-usage.dto';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingItemChargeService: BillingService) {}

  @Post('createUpdateBillingItemCharge')
  async createOrUpdate(@Body() dto: CreateOrUpdateBillingItemChargeDto) {
    return this.billingItemChargeService.createUpdateBillingItemCharge(dto);
  }
  //for Settings
  @Get('getBillItem')
  async getAll(
    @Query('hospitalId') hospitalId?: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('chargeType') chargeType?: string,
    @Query('BillingItemName') BillingItemName?: string,
    @Query('doctorId') doctorId?: number, // ⭐ NEW
  ) {
    return this.billingItemChargeService.getBillItem({
      hospitalId: hospitalId ? Number(hospitalId) : undefined,
      page: Number(page),
      limit: Number(limit),
      chargeType,
      BillingItemName,
      doctorId: doctorId ? Number(doctorId) : undefined, // ⭐ NEW
    });
  }

  @Delete('deleteBillingItemCharge/:id')
  async delete(
    @Param('id') id: number,
    @Query('deletedBy') deletedBy?: number,
  ) {
    return this.billingItemChargeService.deleteBillingItemCharge(
      Number(id),
      deletedBy,
    );
  }
  //for OPD Billing

  @Post('createUpdatePatientBill')
  async createUpdatePatientBill(@Body() body: any, @Req() req: any) {
    const userId = req.user?.id || 1; // replace with JWT user ID
    return this.billingItemChargeService.createOrUpdateBilling(body, userId);
  }

  @Post('cancelBill/:id')
  async cancelBill(
    @Param('id') id: number,
    @Body('reason') reason: string,
    @Req() req: any,
  ) {
    const userId = req.user?.id || 1;
    return this.billingItemChargeService.cancelBilling(
      Number(id),
      reason,
      userId,
    );
  }

  @Get('getByPatient/:patientId')
  async getBillingByPatient(@Param('patientId') patientId: number) {
    return this.billingItemChargeService.getBillingByPatient(Number(patientId));
  }

  //addupdate patient package usage
  @Post('addupdatePatientPackageUsage')
  upsert(@Body() dto: CreatePatientPackageUsageDto) {
    return this.billingItemChargeService.addupdatePatientPackageUsage(dto);
  }

  @Post('syncPatientPackageUsage')
  syncUsage(@Body() body: any) {
    return this.billingItemChargeService.syncPatientPackageUsage(
      body.patientId,
      body.appointmentId,
      body.consultationId,
      body.billingItemChargeIds,
      body.status, // <-- use status
    );
  }

  @Get('getPatientPackageUsage')
  find(
    @Query('PatientPackageUsageId') id?: string,
    @Query('patientId') patientId?: string,
    @Query('AppointmentId') appointmentId?: string,
  ) {
    return this.billingItemChargeService.getPatientPackageUsage(
      id ? +id : undefined,
      patientId ? +patientId : undefined,
    );
  }
}
