import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  title?: Title;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  imageUrl?: string; // Accepts a URL or path from upload service
}

export enum Title{
  Mr = 'Mr',
  Mrs = 'Mrs',
  Miss = 'Miss',
  Ms = 'Ms',
  Dr = 'Dr',
  Prof = 'Prof',
  Other = 'Other',
}