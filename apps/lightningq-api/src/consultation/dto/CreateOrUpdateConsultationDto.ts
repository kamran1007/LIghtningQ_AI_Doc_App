import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ConsultationProcedureDto {
  @IsString()
  ProcedureName!: string;

  @IsOptional()
  @IsString()
  ProcedureCode?: string;

  @IsOptional()
  @IsInt()
  specializationId!: number;

  @IsOptional()
  @IsInt()
  ProcedureId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  createdBy?: number;
}
