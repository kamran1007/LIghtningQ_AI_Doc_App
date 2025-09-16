import { Injectable } from '@nestjs/common';
import { AppointmentService } from 'src/appointment/appointment.service';
import { QuickAppointmentDto } from 'src/appointment/dto/create-appointment.dto';
import { UpdateAppointmentDto } from 'src/appointment/dto/update-appointment.dto';
import { ConsultationService } from 'src/consultation/consultation.service';
import { CreateDiagnosisDto } from 'src/consultation/dto/create-diagnosis.dto';
import { CreateMedicineDto } from 'src/consultation/dto/create-medicine.dto';
import { CreateOrUpdateConsultationDto } from 'src/consultation/dto/create-update-consultation.dto';
import { CreateChiefComplaintDto } from 'src/consultation/dto/CreateCheifcomplaint.dto';
import { CreateInvestigationSubTypeDto } from 'src/consultation/dto/createinvestigationtype.dto';
import { ConsultationProcedureDto } from 'src/consultation/dto/CreateOrUpdateConsultationDto';
import { VitalsDto } from 'src/consultation/dto/vitals.dto';
import { UpsertPatientDto } from 'src/manage-patient/dto/upsert-patient.dto';
import { ManagePatientService } from 'src/manage-patient/manage-patient.service';

@Injectable()
export class PatientcareService {
  constructor(
    private readonly ManagePatientService: ManagePatientService,
    private ManageAppointment: AppointmentService,
    private readonly ConsultationService: ConsultationService,
  ) {}

  async upsertPatient(
    dto: UpsertPatientDto,
    patientImageUrl?: string,
    CreatedBy?: number,
  ) {
    if (CreatedBy === undefined) {
      throw new Error('CreatedBy is required');
    }
    const result = await this.ManagePatientService.upsertPatient(
      dto,
      patientImageUrl,
      CreatedBy,
    );
    return {
      message: 'Patient has been added or updated',
      return: result,
    };
  }

  //Get patient
  async getPatients(arg0: {
    organizationId: number;
    hospitalId: number;
    search: string | undefined;
    city: string | undefined;
    gender: string | undefined;
    tagPatientId: number | undefined;
    minAge: number | undefined;
    maxAge: number | undefined;
    page: number;
    limit: number;
  }) {
    const {
      organizationId,
      hospitalId,
      search,
      city,
      gender,
      tagPatientId,
      minAge,
      maxAge,
      page,
      limit,
    } = arg0;

    const result = await this.ManagePatientService.getPatients({
      organizationId,
      hospitalId,
      search,
      city,
      gender,
      tagPatientId,
      minAge,
      maxAge,
      page,
      limit,
    });
    return {
      message: 'Patient record has get successfully fetch',
      return: result,
    };
  }

  async autosavePatient(dto: UpsertPatientDto, id: any) {
    const result = await this.ManagePatientService.autosavePatient(dto, id);
    return {
      message: 'Patient has been added or updated',
      return: result,
    };
  }

  //get draft patient
  async getDraftPatients(hospitalId: number) {
    const result = await this.ManagePatientService.getDraftPatients(hospitalId);
    return {
      message: 'Draft data has successfully Fetch',
      return: result,
    };
  }

  //get tag patient
  async getAllTags() {
    const result = await this.ManagePatientService.getAllpatientTags();
    return {
      message: 'All patient tag data has successfully Fetch',
      return: result,
    };
  }

  // get all Medical history
  async getAllMedicalHistory() {
    const result = await this.ManagePatientService.getAllpastMedicalHistory();
    return {
      message: 'past Medical History data has successfully Fetch',
      return: result,
    };
  }
  //get all languge
  async getAllLanguages() {
    const result = await this.ManagePatientService.getAllLanguages();
    return {
      message: 'All Languages  data has successfully Fetch',
      return: result,
    };
  }
  //get all allergies
  async getAllAllergies() {
    const result = await this.ManagePatientService.getAllAllergies();
    return {
      message: 'All Allergies data has successfully Fetch',
      return: result,
    };
  }
  // get all specialization
  async getAllSpecialization() {
    const result = await this.ManagePatientService.getAllSpecialization();
    return {
      message: 'All Specialization data has successfully Fetch',
      return: result,
    };
  }

  async getAlldoctoRole(req: any) {
    const result = await this.ManagePatientService.getAlldoctoRole(req);
    return {
      message: 'All Doctor data has successfully Fetch',
      return: result,
    };
  }
  async getAllPaymentMode() {
    const result = await this.ManagePatientService.getAllPaymentMode();
    return {
      message: 'All Payment data has successfully Fetch',
      return: result,
    };
  }

  async getAllVisitType() {
    const result = await this.ManagePatientService.getAllVisitType();
    return {
      message: 'All Visit Type  data has successfully Fetch',
      return: result,
    };
  }

  async getAllTagType() {
    const result = await this.ManagePatientService.getAllTagType();
    return {
      message: 'All Visit Type  data has successfully Fetch',
      return: result,
    };
  }
  //bookAppointment

  async createAppointment(dto: QuickAppointmentDto, CreatedBy) {
    const result = await this.ManageAppointment.BookAppointment(dto, CreatedBy);
    return {
      message: 'Appointment has been added successfully',
      return: result,
    };
  }

  //updateAppointment
  async updateAppointment(dto: UpdateAppointmentDto, UpdatedBy: number) {
    const result = await this.ManageAppointment.updateAppointment(
      dto,
      UpdatedBy,
    );
    return {
      message: 'Appointment have been Updated succesfully',
      return: result,
    };
  }

  //searchAppointment
  async searchAppointments(params: {
    hospitalId: number;
    DoctorId: number;
    status?: string;
    visitTypeId?: number;
    TagPatientId?: number;
    GenderName?: string;
    SpecializationId?: number;
    isConsultationcompleted?: boolean;
    acuity?: string;
    search?: string;
    appointmentDate?: string; // ✅ single date
    appointmentDateFrom?: string; // ✅ date range
    appointmentDateTo?: string;
    minage?: number;
    maxage?: number;
    page?: number;
    limit?: number;
  }) {
    const result = await this.ManageAppointment.searchAppointments(params);

    return {
      message: 'Appointments fetched successfully',
      data: result,
    };
  }

  async upsertVitals(dto: VitalsDto, CreatedBy: number) {
    if (CreatedBy === undefined) {
      throw new Error('CreatedBy is required');
    }
    const result = await this.ConsultationService.upsertVitals(dto, CreatedBy);
    return {
      message: 'Vitals have been added or updated',
      return: result,
    };
  }

  async getVitalsWithHistory(appointmentId: number) {
    const result =
      await this.ConsultationService.getVitalsWithHistory(appointmentId);

    return {
      message: 'vitals fetched successfully',
      data: result,
    };
  }

  async addOrUpdateConsultation(
    dto: CreateOrUpdateConsultationDto,
    CreatedBy: number,
  ) {
    const result = await this.ConsultationService.addOrUpdateConsultation(
      dto,
      CreatedBy,
    );

    return {
      message: 'Consultation created or updated successfully',
      data: result,
    };
  }

  async addOrUpdateSubtype(
    dto: CreateInvestigationSubTypeDto,
    CreatedBy: number,
  ) {
    const result = await this.ConsultationService.addOrUpdateSubtype(
      dto,
      CreatedBy,
    );

    return {
      message: 'investigation type created successfully',
      data: result,
    };
  }
  async addupdatemedicalhistory(
    medicalhistory: string,
    MedicalhistoryId?: number,
  ) {
    const result = await this.ConsultationService.addupdatemedicalhistory(
      medicalhistory,
      MedicalhistoryId,
    );

    return {
      message: 'investigation type created successfully',
      data: result,
    };
  }
  //get GetInvestigationMasterData

  async getInvestigationMasterData() {
    const result = await this.ConsultationService.getInvestigationMasterData();

    return {
      message: 'investigation master data fetched successfully',
      data: result,
    };
  }

  async getConsultationByAppointmentId(appointmentId: number) {
    const result =
      await this.ConsultationService.getpatientConsultationconsultationByAppointmentId(
        appointmentId,
      );

    return {
      message: 'consultation Data successfully fetch',
      data: result,
    };
  }

  async createChiefComplaint(dto: CreateChiefComplaintDto) {
    const result =
      await this.ConsultationService.addOrUpdateChiefComplaint(dto);

    return {
      message: 'chief complaint type created successfully',
      data: result,
    };
  }

  async getAllChiefComplaint() {
    const result = await this.ConsultationService.getAllChiefComplaint();
    return {
      message: 'All Chief Complaint data has successfully Fetch',
      return: result,
    };
  }

  // crate Diagnosis
  async addOrUpdateDiagnosis(dto: CreateDiagnosisDto) {
    const result = await this.ConsultationService.addOrUpdateDiagnosis(dto);
    return {
      message: 'Diagnosis added successfully',
      data: result,
    };
  }

  async getAllDiagnosis() {
    const result = await this.ConsultationService.getAllDiagnosis();
    return {
      message: 'All Diagnosis  data has successfully Fetch',
      return: result,
    };
  }

  async addOrUpdateMedicine(dto: CreateMedicineDto) {
    const result = await this.ConsultationService.addOrUpdateMedicine(dto);

    return {
      message: 'Medicine added successfully',
      data: result,
    };
  }

  async getAllMedicine() {
    const result = await this.ConsultationService.getAllMedicine();
    return {
      message: 'All Medicine data has successfully Fetch',
      return: result,
    };
  }

  async getPatientAppointment(patientId) {
    const result =
      await this.ConsultationService.getPatientAppointment(patientId);
    return {
      message: 'All Patient consultation  data has successfully Fetch',
      return: result,
    };
  }

  //
  async addOrUpdateProcedure(dto: ConsultationProcedureDto, createdby) {
    const result = await this.ConsultationService.addOrUpdateProcedure(
      dto,
      createdby,
    );

    return {
      message: 'Medicine added successfully',
      data: result,
    };
  }

  async getAllConsultationProcedures() {
    const result =
      await this.ConsultationService.getAllConsultationProcedures();
    return {
      message: 'All Procedures consultation  data has successfully Fetch',
      return: result,
    };
  }

  async getmedicalhistory() {
    const result = await this.ConsultationService.getmedicalhistory();
    return {
      message: 'All medical history  data has successfully Fetch',
      return: result,
    };
  }

  async getInvestigationType() {
    const result = await this.ConsultationService.getInvestigationType();
    return {
      message: 'All InvestigationType  data has successfully Fetch',
      return: result,
    };
  }

  //Detele End point
  async deleteMedicine(MedicineId: number) {
    const result = await this.ConsultationService.deleteMedicine(MedicineId);
    return {
      message: 'Medicine have been successfully deleted',
      return: result,
    };
  }

  async deleteChiefComplaint(ChiefComplaintTagId: number) {
    const result =
      await this.ConsultationService.deleteChiefComplaint(ChiefComplaintTagId);
    return {
      message: 'ChiefComplaintTag have been successfully deleted',
      return: result,
    };
  }

  async deleteInvestigation(InvestigationsubTypeId: number) {
    const result = await this.ConsultationService.deleteInvestigation(
      InvestigationsubTypeId,
    );
    return {
      message: 'InvestigationsubType have been successfully deleted',
      return: result,
    };
  }

  async deleteDiagonasis(DiagnosisId: number) {
    const result = await this.ConsultationService.deleteDiagonasis(DiagnosisId);
    return {
      message: 'Diagonasis have been successfully deleted',
      return: result,
    };
  }

  async deleteProcedure(ProcedureId: number) {
    const result = await this.ConsultationService.deleteProcedure(ProcedureId);
    return {
      message: 'Procedure have been successfully deleted',
      return: result,
    };
  }

  async deletemedicalhistory(MedicalHistoryId: number) {
    const result =
      await this.ConsultationService.deleteMedicalHistory(MedicalHistoryId);
    return {
      message: 'Procedure have been successfully deleted',
      return: result,
    };
  }

  async getPatientMedications(patientId: number) {
    const result =
      await this.ConsultationService.getPatientMedications(patientId);
    return {
      message: 'Medicine have  successfully fetch',
      return: result,
    };
  }
}
