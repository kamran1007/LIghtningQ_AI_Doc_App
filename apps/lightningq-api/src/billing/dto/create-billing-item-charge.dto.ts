import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateOrUpdateBillingItemChargeDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  BillingItemChargeId?: number; // for update only

  @ApiProperty({ example: 'Consultation - General' })
  @IsString()
  BillingItemName!: string;

  @ApiProperty({ example: 'CNS-001', required: false })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ example: 'General doctor consultation fee', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  // 🩺 Consultation-specific fields
  @ApiProperty({
    example: 500,
    required: false,
    description: 'Walk-in consultation price',
  })
  @IsOptional()
  @IsNumber()
  walkinPrice?: number;

  @ApiProperty({
    example: 400,
    required: false,
    description: 'Tele consultation price',
  })
  @IsOptional()
  @IsNumber()
  telePrice?: number;

  @ApiProperty({
    example: 100,
    required: false,
    description: 'Fast track appointment charge',
  })
  @IsOptional()
  @IsNumber()
  fastTrackCharges?: number;

  @ApiProperty({
    example: 2,
    required: false,
    description: 'Number of free follow-ups allowed',
  })
  @IsOptional()
  @IsInt()
  numberOfFollowups?: number;

  @ApiProperty({
    example: 15,
    required: false,
    description: 'Follow-up validity in days',
  })
  @IsOptional()
  @IsInt()
  followupValidity?: number;

  @ApiProperty({
    example: 3,
    required: false,
    description: 'Doctor ID linked to consultation',
  })
  @IsOptional()
  @IsInt()
  doctorId?: number;

  // 💰 Common fields
  @ApiProperty({ example: 500, required: false })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  hospitalId!: number;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsInt()
  specializationId?: number;

  // 🔗 Link to AppointmentType
  @ApiProperty({
    example: 1,
    required: false,
    description: 'Appointment Type ID linked to billing item',
  })
  @IsOptional() // make optional if migration allowed NULLs
  @IsInt()
  appointmentTypeId?: number;

  @ApiProperty({
    example: 1,
    required: false,
    description: 'Investigation Type ID linked to billing item',
  })
  @IsOptional() // make optional if migration allowed NULLs
  @IsInt()
  investigationTypeId?: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  chargeTypeId!: number;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsInt()
  maxDiscountPercent?: number;

  @ApiProperty({ example: 50, required: false })
  @IsOptional()
  @IsNumber()
  maxDiscountInr?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 12, required: false })
  @IsOptional()
  @IsInt()
  createdBy?: number;
}
