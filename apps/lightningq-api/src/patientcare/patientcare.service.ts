import { Injectable } from '@nestjs/common';
import { AppointmentService } from 'src/appointment/appointment.service';
import { QuickAppointmentDto } from 'src/appointment/dto/create-appointment.dto';
import { UpdateAppointmentDto } from 'src/appointment/dto/update-appointment.dto';
import { UpsertPatientDto } from 'src/manage-patient/dto/upsert-patient.dto';
import { ManagePatientService } from 'src/manage-patient/manage-patient.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PatientcareService {
  constructor(
    private readonly ManagePatientService: ManagePatientService,
    private ManageAppointment: AppointmentService,
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
    hospitalId: number;
    search: string | undefined;
    city: string | undefined;
    gender: string | undefined;
    tagPatientId: number | undefined;
    dobFrom: string | undefined;
    dobTo: string | undefined;
    page: number;
    limit: number;
  }) {
    const {
      hospitalId,
      search,
      city,
      gender,
      tagPatientId,
      dobFrom,
      dobTo,
      page,
      limit,
    } = arg0;

    const result = await this.ManagePatientService.getPatients({
      hospitalId,
      search,
      city,
      gender,
      tagPatientId,
      dobFrom,
      dobTo,
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
    acuity?: string;
    search?: string;
  }) {
    const result = await this.ManageAppointment.searchAppointments(params);
  
    return {
      message: 'Appointments fetched successfully',
      data: result,
    };
  }
  
}
