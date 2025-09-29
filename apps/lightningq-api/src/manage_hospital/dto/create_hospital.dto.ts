import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsLatitude,
  IsLongitude,
  IsArray,
} from 'class-validator';
import {} from '@prisma/client';
// import {
//   Hospital_Org_status,
//   HospitalLevel,
//   SpecializationType,
// } from '@prisma/client';

enum Hospital_Org_status {
    INACTIVE= "INACTIVE",
    SUSPENDED= "SUSPENDED",
}

enum HospitalLevel {
 SUPER= "SUPER",
    CHILD= "CHILD",
    SUB_CHILD="SUB_CHILD"
}

enum SpecializationType {
GENERAL= "GENERAL",
    OPHTHALMOLOGY= "OPHTHALMOLOGY",
    DENTAL= "DENTAL",
    ENT= "ENT",
    ORTHOPEDIC= "ORTHOPEDIC",
    MULTISPECIALITY= "MULTISPECIALITY",
    OTHER= "OTHER"
}

export class CreateHospitalDto {
  @IsString()
  HospitalName !: string;

  @IsString()
  HospitalCode!: string;

  @IsOptional()
  @IsString()
  ParentHospitalCode!: string;

  @IsOptional()
  @IsString()
  Organizationcode?: string;

  @IsEnum(SpecializationType)
  SpecializationType!: SpecializationType;

  @IsString()
  address!: string;

  @IsString()
  city!: string;

  @IsString()
  state!: string;

  @IsString()
  country!: string;

  @IsString()
  postalCode!: string;

  @IsString()
  contactNumber!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;

  @IsEnum(HospitalLevel)
  level!: HospitalLevel;

  @IsOptional()
  @IsEnum(Hospital_Org_status)
  status?: Hospital_Org_status;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  parentHospitalId?: number;

  @IsNumber()
  organizationId!: number;


  @IsOptional()
  @IsNumber()
  createdById?: number;

  @IsOptional()
  @IsNumber()
  updatedById?: number;

  @IsOptional()
  @IsNumber()
  deletedById?: number;
}
