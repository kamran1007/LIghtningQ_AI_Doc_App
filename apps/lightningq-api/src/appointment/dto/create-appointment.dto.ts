// dto/create-appointment.dto.ts
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  isString,
  IsString,
} from 'class-validator';
import { BloodGroup, GenderType } from '@prisma/client';

export class QuickAppointmentDto {
  // Patient fields
  @IsEnum(['Mr', 'Mrs', 'Miss', 'Ms', 'Prof', 'Other'])
  Prefix?: 'Mr' | 'Mrs' | 'Miss' | 'Ms' | 'Prof' | 'Other'; // ✅ required

  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsEnum(GenderType, {
    message: 'gender must be one of the following values: MALE, FEMALE, OTHER',
  })
  gender?: GenderType;

  // @IsString()
  // hospitalCode!: string;

  // @IsInt()
  // HospitalId!: number;

  @IsInt()
  organizationId!: number;

  @IsOptional()
  @IsString()
  Patient_Medical_Record_No?: string;

  @IsString()
  mobile?: string;

  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  addressLine1?: string;

  // Appointment fields
  @IsInt()
  DoctorId?: number;

  @IsOptional()
  @IsInt()
  DoctorTimeSlotId?: number;

  @IsInt()
  hospitalId!: number;

  @IsInt()
  visitTypeId?: number;

  @IsString()
  VisitReason?: string;

  @IsInt()
  TagPatientId?: number;

  @IsInt()
  paymentTypeId?: number;

  @IsString()
  appointmentDate?: string;

  @IsString()
  appointmentTime?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsInt()
  age?: number;

  @IsOptional()
  @IsInt()
  createdBy?: number;

  @IsBoolean()
  sendWhatsappMessage?: boolean;

  @IsBoolean()
  sendSmsMessage?: boolean;

  @IsBoolean()
  sendEmailMessage?: boolean;

  @IsOptional()
  @IsInt()
  PatientId?: number;

  @IsOptional()
  @IsEnum(BloodGroup)
  bloodGroup?: BloodGroup;

  @IsOptional()
  @IsString()
  acuity?: string;

  @IsOptional()
  @IsString()
  AppointmentCharges?: string;

  @IsOptional()
  @IsBoolean()
  isAmountPaid?: boolean;

  // @IsString()
  // appointmentDate?: string;
}
