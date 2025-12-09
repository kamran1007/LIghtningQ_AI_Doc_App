// src/consultation/dto/create-update-consultation.dto.ts
import {
  IsInt,
  IsOptional,
  IsString,
  IsDateString,
  IsBoolean,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

class ChiefComplaintDto {
  @IsInt()
  ChiefComplaintTagId!: number;
}

// class InvestigationDto {
//   @IsInt()
//   InvestigationTypeId!: number;

//   @IsInt()
//   InvestigationSubTypeId!: number;

//   @IsOptional()
//   @IsString()
//   ConsultationInvestigatRemark?: string;
// }
class InvestigationDto {
  @IsInt()
  BillingItemChargeId!: number;

  @IsOptional()
  @IsString()
  ConsultationInvestigatRemark?: string;
}

class MedicationDto {
  @IsString()
  medicationName!: string;

  @IsOptional()
  @IsString()
  dosage?: string;

  @IsOptional()
  @IsString()
  frequency?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsString()
  unit?: 'Days' | 'Weeks' | 'Months' | 'Years' | 'Lifetime' | 'To Be Continued';

  @IsOptional()
  @IsString()
  remarks?: string;
}

class ClinicalNoteDto {
  @IsString()
  content?: string;
}

class DiagnosisDto {
  @IsOptional()
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
  @IsOptional()
  @IsString()
  treatmentText?: string;

  @IsOptional()
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

// class ConsultationProcedureDto {
//   @IsOptional()
//   @IsString()
//   ProcedureName?: string;

//   @IsOptional()
//   @IsInt()
//   ProcedureId?: number;

//   @IsOptional()
//   @IsString()
//   Description?: string;

//   @IsOptional()
//   @IsDateString()
//   ProcedureDateTime?: string;

//   @IsOptional()
//   @IsBoolean()
//   IsCompleted?: boolean;

//   @IsOptional()
//   @IsString()
//   PerformedBy?: string;

//   @IsOptional()
//   @IsString()
//   Remarks?: string;
// }
class ConsultationProcedureDto {
  @IsInt()
  BillingItemChargeId!: number;

  @IsOptional()
  @IsString()
  ConsultationProcedureRemark?: string;
}

export class CreateOrUpdateConsultationDto {
  // @IsOptional()
  // @IsBoolean()
  // @Transform(
  //   ({ obj }) =>
  //     obj.IsconsultationCompleted ?? obj.IsConsultationCompleted ?? false,
  // )
  // IsConsultationCompleted?: boolean = false;

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
  @Transform(({ value }) => (value === '' ? undefined : value))
  consultationEndDateTime?: string;

  @IsOptional()
  @IsString()
  CheifcomplaintNotes?: string;

  @IsOptional()
  @IsDateString()
  followUpDate?: string;

  @IsOptional()
  @IsBoolean()
  isDraft?: boolean;

  // Nested relationships
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
  @ValidateNested({ each: true })
  @Type(() => ConsultationProcedureDto)
  @IsOptional()
  ConsultationProcedure?: ConsultationProcedureDto[];
}
