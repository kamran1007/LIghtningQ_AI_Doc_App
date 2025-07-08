import {
  IsInt,
  IsOptional,
  IsDateString,
  IsString,
  IsEnum,
} from 'class-validator';

import { AppointmentStatus } from 'generated/prisma';

export class UpdateAppointmentDto {
  @IsInt()
  appointmentId?: number;

  // Appointment updates
  @IsOptional()
  @IsInt()
  DoctorId?: number;

  @IsOptional()
  @IsDateString()
  appointmentDay?: string;

  @IsOptional()
  @IsString()
  appointmentTime?: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsString()
  reason?: string;

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
}
