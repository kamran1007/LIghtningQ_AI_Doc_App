// src/consultation/dto/create-update-consultation.dto.ts
import {
  IsInt,
  IsOptional,
  IsString,
  IsDateString,
  IsBoolean,
  ValidateNested,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class ChiefComplaintDto {
  @IsInt()
  ChiefComplaintTagId!: number;

  // ChiefComplainTagName?: string;
}

class InvestigationDto {
  @IsInt()
  InvestigationTypeId!: number;

  @IsInt()
  InvestigationSubTypeId!: number;

  @IsOptional()
  @IsString()
  ConsultationInvestigatRemark?: string;
}

class MedicationDto {
  @IsString()
  medicationName?: string;

  @IsString()
  dosage?: string;

  @IsString()
  frequency?: string;

  @IsString()
  duration?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}

class ClinicalNoteDto {
  @IsString()
  content?: string;
}

class DiagnosisDto {
  @IsInt()
  diagnosisId?: number;

  @IsOptional()
  @IsString()
  DiagnosisName?: string;

  @IsOptional()
  @IsString()
  DiagnosisRemark?: string;
}

class TreatmentDto {
  @IsString()
  treatmentText?: string;

  @IsString()
  source?: 'TYPED' | 'DICTATED' | 'SNIPPET';
}

class FollowUpPlanDto {
  @IsOptional()
  @IsString()
  followUpText?: string;

  @IsOptional()
  @IsInt()
  duration?: number;

  @IsOptional()
  @IsString()
  unit?: 'Days' | 'Weeks' | 'Months' | 'Years';

  @IsOptional()
  @IsDateString()
  nextDate?: string;
}

class ConsultationProcedureDto {

  

  @IsOptional()
  @IsString()
  ProcedureName?: string;

  @IsOptional()
  @IsInt()
  ProcedureId?: number;

  @IsOptional()
  @IsString()
  Description?: string;

}

export class CreateOrUpdateConsultationDto {
  // @IsInt()
  // PatientId!: number;

  //  @IsInt()
  // DoctorId!: number;
  @IsOptional()
  @IsBoolean()
  IsconsultationCompleted?: boolean = false;

  @IsOptional()
  @IsBoolean()
  IsSentCaseSheet?: boolean = false;

  @IsOptional()
  @IsInt()
  ConsultationId?: number;

  @IsInt()
  AppointmentId!: number;

  @IsOptional()
  @IsDateString()
  consultationDatTime?: string;

  @IsOptional()
  @IsDateString()
  consultationEndDateTime?: string;

  @IsOptional()
  @IsString()
  CheifcomplaintNotes?: string;

  @IsOptional()
  @IsDateString()
  followUpDate?: string;

  @IsOptional()
  @IsBoolean()
  isDraft?: boolean; //Auto save feature (future implementation)

  // Nested arrays
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChiefComplaintDto)
  ConsultationCheifComplaint?: ChiefComplaintDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvestigationDto)
  ConsultationInvestigation?: InvestigationDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicationDto)
  ConsultationMedication?: MedicationDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClinicalNoteDto)
  ConsultationclinicalNotes?: ClinicalNoteDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DiagnosisDto)
  ConsultationDiagnosis?: DiagnosisDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TreatmentDto)
  ConsultationTreatment?: TreatmentDto[];

  @ValidateNested()
  @Type(() => FollowUpPlanDto)
  @IsOptional()
  ConsultationFollowUpPlan?: FollowUpPlanDto;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ConsultationProcedureDto)
  ConsultationProcedure?: ConsultationProcedureDto[];
}
