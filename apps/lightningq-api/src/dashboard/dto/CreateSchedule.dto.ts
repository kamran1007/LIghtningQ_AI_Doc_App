import { IsInt, IsString, IsArray, IsIn, IsDateString } from 'class-validator';

export class CreateScheduledReportDto {
  @IsInt()
  hospitalId!: number;
  
  @IsInt()
  adminId!: number;

  @IsIn(['Weekly', 'Monthly'])
  frequency!: 'Weekly' | 'Monthly';

  @IsArray()
  @IsString({ each: true })
  reportTypes?: string[];

  @IsDateString()
  nextRunAt?: string; // optional, otherwise calculated
}
