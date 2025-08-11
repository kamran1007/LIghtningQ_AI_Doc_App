import {
  IsString,
  IsInt,
  IsOptional,
  IsNumber,
  IsDateString,
  IsArray,
} from 'class-validator';

export class CreateMedicineDto {
  @IsOptional()
  @IsInt()
  MedicineId?: number;
  @IsString()
  MedicineName!: string;

  @IsString()
  OnlyMedicineName?: string;

  @IsOptional()
  @IsString()
  Strength?: string;

  @IsOptional()
  @IsString()
  Units?: string;

  @IsOptional()
  @IsNumber()
  MedicineUnitId?: number;

  @IsOptional()
  @IsString()
  ScheduleType?: string;

  @IsOptional()
  @IsString()
  MedicineTypeName?: string;

  @IsOptional()
  @IsNumber()
  MedicineType?: number;

  @IsOptional()
  @IsString()
  HSNCode?: string;

  @IsOptional()
  @IsString()
  Instructions?: string;

  @IsOptional()
  @IsString()
  GenericName?: string;

  @IsOptional()
  @IsNumber()
  ScheduleTypeId?: number;

  @IsOptional()
  @IsNumber()
  UserId?: number;

  @IsOptional()
  @IsNumber()
  AvailableStock?: number;

  @IsOptional()
  @IsNumber()
  HospitalId?: number;

  @IsOptional()
  @IsNumber()
  pharmacyPrice?: number;

  @IsOptional()
  @IsNumber()
  CategoryId?: number;

  @IsOptional()
  @IsString()
  IsFrequent?: string;

  @IsOptional()
  @IsDateString()
  updatedAt?: number;

  @IsOptional()
  @IsDateString()
  createdAt?: number;

    @IsOptional()
  @IsArray()
  ConsultationMedication?: any[] = [];
}
