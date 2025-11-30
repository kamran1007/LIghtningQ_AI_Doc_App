import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BillingItemDto {
  @IsNumber()
  BillingItemChargeId?: number;

  @IsString()
  BillingItemName?: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsNumber()
  gst?: number;

  @IsNumber()
  netAmount?: number;
}

export class BillingPaymentDto {
  @IsString()
  paymentMode?: string; // Cash, Card, UPI, Cheque, etc.

  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}

export class CreateBillingDto {
  @IsNumber()
  patientId?: number;

  @IsOptional()
  @IsNumber()
  appointmentId?: number;

  @IsNumber()
  hospitalId?: number;

  @IsNumber()
  organizationId?: number;

  @IsNumber()
  doctorId?: number;

  @IsNumber()
  subtotal?: number;

  @IsOptional()
  @IsNumber()
  totalDiscount?: number;

  @IsOptional()
  @IsNumber()
  totalTax?: number;

  @IsOptional()
  @IsString()
  overallDiscountType?: 'flat' | 'percent';

  @IsOptional()
  @IsNumber()
  overallDiscountValue?: number;

  @IsNumber()
  netAmount?: number;

  @IsNumber()
  amountPaid?: number;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsString()
  billStatusName?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BillingItemDto)
  items?: BillingItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BillingPaymentDto)
  payments?: BillingPaymentDto[];
}
