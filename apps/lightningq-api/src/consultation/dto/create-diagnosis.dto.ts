import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateDiagnosisDto {
  @IsOptional()
  @IsInt()
  DiagnosisId?: number;

  @IsString()
  DiagnosisName?: string;

  @IsOptional()
  @IsString()
  icdCode?: string;

  @IsOptional()
  @IsInt()
  specializationId?: number;
}
