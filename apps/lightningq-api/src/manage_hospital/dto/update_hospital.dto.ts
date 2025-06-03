// dto/update-hospital.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateHospitalDto } from './create_hospital.dto';

export class UpdateHospitalDto extends PartialType(CreateHospitalDto) {}
