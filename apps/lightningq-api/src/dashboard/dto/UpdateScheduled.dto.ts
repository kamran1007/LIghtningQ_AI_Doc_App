import { IsOptional, IsString, IsArray, IsDateString, IsIn } from 'class-validator';

export class UpdateScheduledReportDto {
  @IsOptional()
  @IsIn(['Weekly', 'Monthly'])
  frequency?: 'Weekly' | 'Monthly';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  reportTypes?: string[];   // ✅ if you send new array, it will overwrite old one

  @IsOptional()
  @IsDateString()
  nextRunAt?: string;
}
