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



  @IsOptional()
  @IsString()
  DNDremarks?: string;

  @IsOptional()
  @IsString()
  Slot_cancellation_remarks?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_DND?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_SlotCancelled?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isPermanentCancelled?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isDeleted?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isSlotChanged?: boolean;
  // Indicates if the slot has been changed
}

export class AddUpdateTimeSlotDto {
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsBoolean()
  Accept_Appointment_Selected_Date?: boolean; // ✅ GLOBAL VALUE

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  timeSlots?: TimeSlotDto[];
}
