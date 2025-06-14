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
import { Type, Transform } from 'class-transformer';

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
  SignatureOfUser?: string;

  @IsOptional()
  @IsString()
  Experience?: string;

  @IsOptional()
  @IsString()
  Employee_ID?: string;

  @IsOptional()
  @IsInt()
  SpecializationId?: number;

  @IsInt()
  organizationId!: number;

  @IsInt()
  roleId!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserBranchDto)
  @Transform(({ value }) => {
    try {
      return typeof value === 'string' ? JSON.parse(value) : value;
    } catch {
      return [];
    }
  })
  UserBranchesArray!: UserBranchDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserOrganizationDto)
  @Transform(({ value }) => {
    try {
      return typeof value === 'string' ? JSON.parse(value) : value;
    } catch {
      return [];
    }
  })
  UserOrganizationArray!: UserOrganizationDto[];

  @IsOptional()
  @IsString()
  passwordHash?: string;

  @IsOptional()
  @IsInt()
  createdById?: number;

  @IsOptional()
  @IsInt()
  updatedById?: number;

  @IsOptional()
  @IsInt()
  deletedById?: number;
}
