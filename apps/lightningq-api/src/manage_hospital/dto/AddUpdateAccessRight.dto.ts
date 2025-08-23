import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
  ArrayNotEmpty,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

// ---------------- RolePermission DTO ----------------
export class RolePermissionDto {
  @IsOptional()
  @IsInt()
  RolePermissionId?: number;

  @IsInt()
  RoleId!: number;

  @IsInt()
  UserId!: number;

  @IsInt()
  HospitalId!: number;

  @IsInt()
  OrganizationId!: number;
}

// ---------------- Permission DTO ----------------
export class PermissionDto {
  @IsOptional()
  @IsInt()
  PermissionId?: number;

  @IsOptional()
  @IsBoolean()
  CanView?: boolean;

  @IsOptional()
  @IsBoolean()
  CanCreate?: boolean;

  @IsOptional()
  @IsBoolean()
  CanUpdate?: boolean;

  @IsOptional()
  @IsBoolean()
  CanDelete?: boolean;

  @IsOptional()
  @IsBoolean()
  CanAI_Assist?: boolean;

  @IsOptional()
  @IsBoolean()
  IsActive?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RolePermissionDto)
  RolePermissions?: RolePermissionDto[];
}

// ---------------- SubModule DTO ----------------
export class SubModuleDto {
  @IsOptional()
  @IsInt()
  SubModuleId?: number;

  @IsOptional()
  @IsString()
  SubModuleName?: string;

  @IsOptional()
  @IsBoolean()
  IsActive?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  Permissions?: PermissionDto[];
}

// ---------------- Module DTO ----------------
export class ModuleDto {
  @IsOptional()
  @IsNumber()
  ModuleId?: number;

  @IsOptional()
  @IsString()
  ModuleName?: string;

  @IsOptional()
  @IsBoolean()
  IsActive?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubModuleDto)
  SubModules?: SubModuleDto[];
}

// ---------------- Main DTO ----------------
export class AddUpdateAccessRightDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ModuleDto)
  Modules!: ModuleDto[];
}
