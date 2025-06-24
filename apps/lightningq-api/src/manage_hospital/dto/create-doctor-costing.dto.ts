import {
    IsArray,
    IsBoolean,
    IsNumber,
    IsOptional,
    IsPositive,
  } from 'class-validator';
  
  export class CreateDoctorCostingDto {
    @IsNumber()
    doctorId?: number;
  
    @IsArray()
    hospitalIds?: number[];
  
    @IsNumber()
    @IsPositive()
    walkInFee?: number;
  
    @IsOptional()
    @IsNumber()
    teleConsultFee?: number;
  
    @IsOptional()
    @IsNumber()
    fastTrackFee?: number;
  
    @IsOptional()
    @IsNumber()
    homeVisitFee?: number;
  
    @IsOptional()
    @IsNumber()
    emergencyFee?: number;
  
    @IsOptional()
    @IsNumber()
    procedureFee?: number;
  
    @IsOptional()
    @IsNumber()
    freeFollowupCount?: number;
  
    @IsOptional()
    @IsNumber()
    followupValidityDays?: number;
  
    @IsOptional()
    @IsNumber()
    tax?: number;
  
    @IsOptional()
    @IsNumber()
    discount?: number;
  
    @IsOptional()
    @IsNumber()
    commission?: number;
  
    @IsBoolean()
    insuranceApplicable?: boolean;

    @IsOptional()
    @IsNumber()
    CreatedById?: number;
  }
  