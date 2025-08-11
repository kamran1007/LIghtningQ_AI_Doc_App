import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateChiefComplaintDto {
  @IsOptional()
  @IsInt()
  ChiefComplaintTagId?: number;

  @IsString()
  ChiefComplainTagName?: string;

  @IsOptional()
  @IsInt()
  SpecializationId!: number;
}
