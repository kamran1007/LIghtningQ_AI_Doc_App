import { 
  IsInt, 
  IsArray, 
  IsOptional, 
  IsString, 
  IsBoolean, 
  ValidateNested 
} from "class-validator";
import { Type } from "class-transformer";

// =======================
// GLOBAL LOGOS (Names are optional because files may replace them)
// =======================
export class GlobalLogosDto {
  
  // These are URLs stored in DB after R2 upload
  @IsOptional() @IsString() printHeaderImgUrl?: string;
  @IsOptional() @IsString() printHeaderImgAlignment?: string;
  @IsOptional() @IsString() printImageHeaderUrl?: string;
  @IsOptional() @IsString() printImageFooterUrl?: string;

  // These will be FILES received by Multer (NOT strings)
  @IsOptional() headerLogoFile?: Express.Multer.File;
  @IsOptional() imageHeaderFile?: Express.Multer.File;
  @IsOptional() imageFooterFile?: Express.Multer.File;
}

// =======================
// PAGE SETTINGS
// =======================
export class PageSettingsDto {
  @IsString() pageSize!: string;
  @IsString() pageOrientation!: string;

  @IsInt() marginTop!: number;
  @IsInt() marginBottom!: number;
  @IsInt() marginLeft!: number;
  @IsInt() marginRight!: number;
}

// =======================
// CUSTOM SETTINGS
// =======================
export class CustomSettingsDto {
  @IsOptional() @IsString() headerSettings?: string;
  @IsOptional() @IsString() contentSettings?: string;
  @IsOptional() @IsString() footerSettings?: string;
}

// =======================
// PRINT DETAIL
// =======================
export class PrintDetailDto {
  @IsInt()
  printPageId!: number;

  @IsString()
  letterHeadValue!: string;

  @ValidateNested()
  @Type(() => PageSettingsDto)
  pageSettings!: PageSettingsDto;

  @ValidateNested()
  @Type(() => CustomSettingsDto)
  customSettings!: CustomSettingsDto;

  // Optional: Per-page logos
  @IsOptional() pageLogoFile?: Express.Multer.File;
}

// =======================
// UPSERT PRINT SETTINGS DTO
// =======================
export class UpsertPrintSettingDto {
  @IsInt() DoctorPrintSettingId!: number;
  @IsInt() parentOrganizationId!: number;
  @IsInt() hospitalId!: number;
  @IsInt() userId!: number;

  @IsOptional() @IsInt() language?: number;
  @IsOptional() @IsBoolean() type?: boolean;

  @ValidateNested()
  @Type(() => GlobalLogosDto)
  globalLogos!: GlobalLogosDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrintDetailDto)
  Printdetails!: PrintDetailDto[];
}
