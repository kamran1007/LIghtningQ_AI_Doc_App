import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TimeSlotDto {
  @IsString()
  DayOfWeek?: string;

  @IsInt()
  hospitalId?: number;

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

  @IsInt()
  consult_Time_InMin?: number;

  @IsBoolean()
  Accept_Appointment_Selected_Date?: boolean;

  @IsOptional()
  @IsString()
  DNDremarks?: string;

  @IsOptional()
  @IsString()
  Slot_cancellation_remarks?: string;

  @IsOptional()
  @IsBoolean()
  is_DND?: boolean;

  @IsOptional()
  @IsBoolean()
  is_SlotCancelled?: boolean;

  @IsOptional()
  @IsBoolean()
  isPermanentCancelled?: boolean;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}

export class CreateDoctorSlotDto {
  @IsInt()
  userId?: number;

  // @IsInt()
  // hospitalId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  timeSlots?: TimeSlotDto[];
}
