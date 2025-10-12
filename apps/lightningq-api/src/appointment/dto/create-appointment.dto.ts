// dto/create-appointment.dto.ts
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';

// ✅ Local enums instead of relying on @prisma/client
export enum GenderType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum BloodGroup {
  A_POS = 'A_POS',
  A_NEG = 'A_NEG',
  B_POS = 'B_POS',
  B_NEG = 'B_NEG',
  O_POS = 'O_POS',
  O_NEG = 'O_NEG',
  AB_POS = 'AB_POS',
  AB_NEG = 'AB_NEG',
}

export class QuickAppointmentDto {
  // Patient fields
  @IsEnum(['Mr', 'Mrs', 'Miss', 'Ms', 'Prof', 'Other'])
  Prefix?: 'Mr' | 'Mrs' | 'Miss' | 'Ms' | 'Prof' | 'Other';

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

  @IsString()
  hospitalCode!: string;

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

  @IsOptional()
  @IsString()
  cancellationReason?: string;

  @IsOptional()
  @IsInt({ each: true })
  TagPatientIds?: number[];

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
  @IsBoolean()
  fasttrackpatient?: boolean;

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
  @IsEnum(BloodGroup, {
    message:
      'bloodGroup must be one of: A_POS, A_NEG, B_POS, B_NEG, O_POS, O_NEG, AB_POS, AB_NEG',
  })
  bloodGroup?: BloodGroup;

  @IsOptional()
  @IsString()
  acuity?: string;

  @IsOptional()
  @IsString()
  AppointmentChargesPaid?: string;

  @IsOptional()
  @IsBoolean()
  isAmountPaid?: boolean;

  @IsOptional()
  @IsString()
  ActualAppointmentCharges?: string;

  @IsOptional()
  @IsString()
  DiscountOnAppointment?: string;

  @IsOptional()
  @IsString()
  FastTrackCharges?: string;

  @IsOptional()
  @IsString()
  TotalAppointmentCharges?: string;

  @IsOptional()
  @Type(() => Number)
  SpecializationId?: number;
}
