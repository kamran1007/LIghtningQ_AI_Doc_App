import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreatePatientPackageUsageDto {
  @IsOptional()
  @IsInt()
  PatientPackageUsageId?: number;

  @IsOptional()
  @IsInt()
  patientId?: number;

  @IsOptional()
  @IsBoolean()
  IsFastTrack?: boolean;

  @IsOptional()
  @IsBoolean()
  IsFreeFollowUp?: boolean;

  @IsOptional()
  @IsBoolean()
  packageId?: number;

  @IsOptional()
  @IsInt()
  appointmentId?: number;

  @IsOptional()
  @IsInt()
  consultationId?: number;

  @IsInt()
  billingItemChargeId?: number;

  @IsOptional()
  @IsString()
  status?: string; // defaults to Active
}
