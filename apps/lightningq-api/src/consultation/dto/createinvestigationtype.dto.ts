import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateInvestigationSubTypeDto {
  @IsOptional()
  @IsInt()
  InvestigationSubTypeId?: number;

  @IsInt()
  InvestigationTypeId!: number;

  @IsString()
  InvestigationSubTypename?: string;
}
