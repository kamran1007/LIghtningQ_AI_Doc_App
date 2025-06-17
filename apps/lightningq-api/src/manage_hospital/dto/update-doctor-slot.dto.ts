// dto/update-doctor-slot.dto.ts
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';

export class UpdateDoctorSlotDto {
  @IsNumber()
  DoctorTimeSlotId?: number;
  @IsNumber()
  userId?: number;

  @IsNumber()
  HospitalId?: number;
  @IsOptional()
  @IsString()
  DayOfWeek?: string;

  @IsOptional()
  @IsString()
  Morning_From?: string;

  @IsOptional()
  @IsString()
  Morning_To?: string;

  @IsOptional()
  @IsString()
  Evening_From?: string;

  @IsOptional()
  @IsString()
  Evening_To?: string;

  @IsOptional()
  @IsNumber()
  consult_Time_InMin?: number;

  @IsOptional()
  @IsBoolean()
  Accept_Appointment_Selected_Date?: boolean;

  @IsOptional()
  @IsString()
  DNDremarks?: string;

  @IsOptional()
  @IsString()
  Slot_cancellation_remarks?: string;
}
