import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class CancelSlotDto {
    @IsArray()
    @IsNumber({}, { each: true })
    DoctorTimeSlotId?: number[];
  
    @IsOptional()
    @IsString()
    cancellationRemarks?: string;
  }
  