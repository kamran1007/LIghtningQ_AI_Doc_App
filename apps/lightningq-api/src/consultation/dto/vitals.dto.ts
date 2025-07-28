// dto/vitals.dto.ts
import { IsInt, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { BloodGroup } from '@prisma/client';

export class VitalsDto {
  @IsInt()
  AppointmentId!: number;

  @IsOptional() @IsInt()
  Systolic?: number;

  @IsOptional() @IsInt()
  Diastolic?: number;

  @IsOptional() @IsNumber()
  Weight?: number;

  @IsOptional() @IsNumber()
  Temperature?: number;

  @IsOptional() @IsInt()
  HeartRate?: number;

  @IsOptional() @IsNumber()
  OxygenSaturation?: number;

  @IsOptional() @IsNumber()
  Height?: number;

  @IsOptional()  @IsEnum(BloodGroup)
  BloodGroup?: BloodGroup;

  @IsOptional() @IsNumber()
  BMI?: number;
}
