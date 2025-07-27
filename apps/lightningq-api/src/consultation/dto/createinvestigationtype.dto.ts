import { IsInt, IsString } from 'class-validator';

export class CreateInvestigationSubTypeDto {
  @IsInt()
  InvestigationTypeId!: number;

  @IsString()
  InvestigationSubTypename?: string;
}
