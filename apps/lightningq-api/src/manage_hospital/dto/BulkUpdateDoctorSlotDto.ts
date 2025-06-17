import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class BulkUpdateDoctorSlotDto {
    @IsNumber()
    userId?: number;
  
    @IsNumber()
    HospitalId?: number;
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SlotUpdateDetails)
    slots?: SlotUpdateDetails[];
  }
  
  export class SlotUpdateDetails {
    @IsNumber()
    DoctorTimeSlotId?: number;
  
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
  