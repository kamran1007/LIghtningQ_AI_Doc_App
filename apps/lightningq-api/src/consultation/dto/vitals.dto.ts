// dto/vitals.dto.ts
import { IsInt, IsOptional, IsNumber, IsEnum } from 'class-validator';
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
