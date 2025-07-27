import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateDiagnosisDto {
  @IsString()
  DiagnosisName?: string;

  @IsOptional()
  @IsString()
  icdCode?: string;

  @IsOptional()
  @IsInt()
  specializationId?: number;
}
