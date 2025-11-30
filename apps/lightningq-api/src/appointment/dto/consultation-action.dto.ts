import { IsOptional, IsString, IsEnum, IsInt } from 'class-validator';

export class ConsultationActionDto {
  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsInt()
  userId?: number; // Or number if needed
}
