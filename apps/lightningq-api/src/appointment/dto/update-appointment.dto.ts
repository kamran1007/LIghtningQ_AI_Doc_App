import {
  IsInt,
  IsOptional,
  IsDateString,
  IsString,
  IsEnum,
  IsBoolean,
} from 'class-validator';

import { AppointmentStatus } from '@prisma/client';

export class UpdateAppointmentDto {
  @IsInt()
  AppointmentId?: number;

  // Appointment updates
  @IsOptional()
  @IsInt()
  DoctorId?: number;

  @IsOptional()
  @IsInt()
  DoctorTimeSlotId?: number;

  // @IsOptional()
  // @IsDateString()
  // appointmentDate?: string;

  @IsString()
  appointmentDate?: string;

  @IsOptional()
  @IsString()
  appointmentTime?: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  RescheduleReason?: string;

  @IsOptional()
  @IsString()
  cancellationReason?: string;
  // Optional patient info (allowed for quick registered)
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsInt()
  updatedBy?: number;

  @IsOptional()
  @IsInt()
  updatedAt?: number;

  @IsBoolean()
  sendWhatsappMessage?: boolean;

  @IsBoolean()
  sendSmsMessage?: boolean;

  @IsBoolean()
  sendEmailMessage?: boolean;

  @IsOptional()
  @IsBoolean()
  fasttrackpatient?: boolean;
}
