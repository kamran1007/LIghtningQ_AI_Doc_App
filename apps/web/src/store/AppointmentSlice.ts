import { GetFilterSearchappointment } from '@/lib/bookappointment';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Extended type definitions based on your API response
export interface Specialization {
  SpecializationId: number;
  SpecializationName: string;
  Description: string;
}

export interface Doctor {
  UserId: number;
  DoctorId?: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  gender: string;
  dateOfBirth: string;
  Prefix: string;
  Employee_ID: string;
  Experience: string;
  SpecializationId: number;
  Specialization: Specialization;
  SignatureOfUser: string;
  imageUrl: string;
  isActive: boolean;
  roleId: number;
  organizationId: number;
  createdAt: string;
}

export interface Patient {
  PatientId: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  gender: string;
  dateOfBirth: string;
  Prefix: string;
  Patient_Medical_Record_No: string;
  bloodGroup: string | null;
  city: string;
  state: string;
  country: string;
  addressLine1: string | null;
  addressLine2: string | null;
  postalCode: number;
  isQuickRegistered: boolean;
  isDraft: boolean;
  HospitalId: number;
  OrganizationId: number;
  createdAt: string;
  updatedAt: string;
  allergies: any[];
  medicalHistory: any[];
  languages: any[];
  TagPatient: TagPatient[];
}

export interface TagPatient {
  TagPatientId: number;
  TagPatientName: string;
}

export interface VisitType {
  AppointmentTypeId: number;
  AppointmentTypeName: string;
}

export interface Hospital {
  HospitalId: number;
  HospitalName: string;
  HospitalCode: string;
  ParentHospitalCode: string;
  Organizationcode: string;
}

export interface Appointment {
  AppointmentId: number;
  PatientId: number;
  DoctorId: number;
  SpecializationId: number;
  hospitalId: number;
  visitTypeId: number;
  appointmentDate: string;
  rescheduledDate: string | null;
  status: 'SCHEDULED' | 'RESCHEDULED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  reason: string;
  acuity: 'LOW' | 'MEDIUM' | 'HIGH';
  isDraft: boolean;
  fasttrackpatient: boolean;
  IsConsultationCompleted: boolean;
  consultationId: number | null;
  paymentHistoryId: number;
  paymentTypeId: number;
  sendEmailMessage: boolean;
  sendSmsMessage: boolean;
  sendWhatsappMessage: boolean;
  cancellationReason: string;
  RescheduleReason: string;
  rescheduledAt: string | null;
  rescheduledBy: number | null;
  createdAt: string;
  createdBy: number;
  AssignedProviderId: number | null;
  age: number | null;
  
  // Nested relationships
  doctor: Doctor;
  patient: Patient;
  visitType: VisitType;
  hospital: Hospital;
  TagPatients: TagPatient[];
  Vitals: any[];
  consultation: any | null;
}

export interface AppointmentState {
  data: Appointment[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
}

export interface AppointmentApiResponse {
  data: Appointment[];
  total: number;
  page: number;
  limit: number;
}

export const fetchAllAppointmentPatient = createAsyncThunk<
  AppointmentApiResponse,
  Record<string, string | number | undefined>
>(
  'appointments/fetchAll',
  async (filters) => {
    const response = await GetFilterSearchappointment(filters);
    console.log("Appointment List Response:", response);
    
    // Return the data property which contains the nested structure
    return response.data;
  }
);

const initialState: AppointmentState = {
    data: [] as Appointment[],
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,
};

const AppointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    clearAppointments: (state) => {
      state.data = [];
      state.total = 0;
      state.page = 1;
      state.error = null;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAppointmentPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAppointmentPatient.fulfilled, (state, action) => {
        // Extract data from the nested response structure
        state.data = action.payload.data || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 10;
        state.loading = false;
        
        console.log("Stored appointments in state:", state.data);
        console.log("Total appointments:", state.total);
      })
      .addCase(fetchAllAppointmentPatient.rejected, (state, action) => {
        state.error = action.error.message || 'Error fetching appointments';
        state.loading = false;
        state.data = [];
        console.error("Appointment fetch error:", action.error);
      });
  },
});

export const { clearAppointments, setPage, setLimit } = AppointmentSlice.actions;
export default AppointmentSlice.reducer;