import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsDate,
  IsInt,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Title, BloodGroup,GenderType } from '@prisma/client';

export class UpsertPatientDto {
  // System fields
  @IsOptional()
  PatientId?: number;

  @IsOptional()
  FullName?: string;

  @IsString()
  hospitalCode!: string;

  @Type(() => Number)
  @IsInt()
  HospitalId!: number;

  @Type(() => Number)
  @IsInt()
  organizationId!: number;

  @IsOptional()
  @IsString()
  Patient_Medical_Record_No?: string;

  // @IsOptional()
  // @IsString()
  // patientImageUrl?: string;

  // Basic Details
  @IsEnum(Title)
  Prefix!: Title;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @Type(() => Date)
  @IsDate()
  dateOfBirth!: Date;

  @IsOptional()
  @IsEnum(GenderType, { message: 'gender must be one of the following values: MALE, FEMALE, OTHER' })
  gender?: GenderType;

  // Contact Info
  @IsString()
  mobile!: string;

  @IsOptional()
  @IsString()
  altContactNumber?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  addressLine1?: string;

  @IsOptional()
  @IsString()
  addressLine2?: string;

  @IsOptional()
  @IsString()
  area?: string;

  @IsString()
  city!: string;

  @IsOptional()
  @IsString()
  cityId?: string;

  @IsString()
  state!: string;

  @IsString()
  country!: string;

  @Type(() => Number)
  @IsInt()
  postalCode!: number;

  @IsOptional()
  @IsString()
  landmark?: string;

  @IsOptional()
  @IsString()
  taluka?: string;

  // Emergency Contact
  @IsOptional()
  @IsString()
  emergencyName?: string;

  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @IsOptional()
  @IsString()
  emergencyRelation?: string;

  // Kin Info
  @IsOptional()
  @IsString()
  kinName?: string;

  @IsOptional()
  @IsString()
  kinContact?: string;

  @IsOptional()
  @IsString()
  kinRelation?: string;

  // Meta
  @IsOptional()
  @IsString()
  profileImageUrl?: string;

  @IsEnum(BloodGroup)
  bloodGroup!: BloodGroup;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return undefined;
  })
  isDraft?: boolean;

  // Tags
  @IsOptional()
  allergies?: string[]; // array of AllergyId as string
  @IsOptional()
  languages?: string[]; // array of LanguageId as string
  @IsOptional()
  MedicalHistory ?: string[]; // array of MedicalHistoryId as string

  // @IsOptional()
  // TagPatient?: string[]

  // Audit (optional)
  @IsOptional()
  @IsString()
  CreatedBy?: string;

  @IsOptional()
  @IsString()
  UpdatedBy?: string;
}
