import {
  IsString,
  IsDateString,
  IsEmail,
  IsEnum,
  IsArray,
  ValidateNested,
  IsInt,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UserBranchDto {
  @IsInt()
  OrganizationId!: number;

  @IsInt()
  RoleId!: number;

  @IsString()
  RoleName!: string;

  @IsInt()
  HospitalId!: number;

  @IsString()
  BranchName!: string;

  @IsString()
  ActiveInd!: 'Y' | 'N';

  @IsString()
  DeleteInd!: 'Y' | 'N';
}

export class UserOrganizationDto {
  @IsInt()
  OrganizationId!: number;

  @IsString()
  OrganizationName!: string;

  @IsString()
  ActiveInd!: 'Y' | 'N';

  @IsString()
  DeleteInd!: 'Y' | 'N';
}

export class CreateUserDto {
  @IsString()
  Prefix!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsDateString()
  dateOfBirth!: string;

  @IsString()
  gender!: string;

  @IsString()
  mobile!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  SignatureOfUser?: string; // Match Prisma field name

  @IsOptional()
  @IsString()
  Experience?: string; // Match Prisma

  @IsOptional()
  @IsString()
  Employee_ID?: string; // Match Prisma

  @IsOptional()
  @IsInt()
  SpecializationId?: number; // Match Prisma

  @IsInt()
  organizationId!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserBranchDto)
  UserBranchesArray!: UserBranchDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserOrganizationDto)
  UserOrganizationArray!: UserOrganizationDto[];

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsInt()
  createdById?: number;

  @IsOptional()
  @IsInt()
  updatedById?: number;

  @IsOptional()
  @IsInt()
  deletedById?: number;

  @IsInt()
  roleId!: number; // ✅ ADD THIS

  // @IsArray()
  // @IsInt({ each: true })
  // HospitalIds!: number[]; // ✅ ADD THIS
}
