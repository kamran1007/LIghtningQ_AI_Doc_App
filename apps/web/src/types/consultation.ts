// types/consultation.ts
export interface Procedure {
  label: string;
  ProcedureId: number; // always number
}

export interface Medication {
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  unit?: string; // Days, Weeks, etc.
  remarks: string;
}

export interface Investigation {
  InvestigationTypeId: number;
  InvestigationSubTypeId: number;
  value: string;
}

export interface ConsultationFormValues {
  bloodgroup: string;
  // add the other fields you are managing with RHF:
  followUpDuration: string;
  followUpUnit: string;
  clinicalnotesText: string;
  systolic: string;
  diastolic: string;
  weight: string;
  temperature: string;
  heartRate: string;
  oxygen: string;
  height: string;
  BMI: string;
  BMIStatus: string;
  complaint: string;
  notes: string;
  investigations: Investigation[];
  investigationRemarks: Record<string, string>;
  diagnosis: string;
  treatment: string;
  followUp: string;
  complaints: any[];
   medications: Medication[];
}


