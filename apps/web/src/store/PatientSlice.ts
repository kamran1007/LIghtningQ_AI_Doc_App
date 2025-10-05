import { GetFilterSearchPatient, PatientFilter } from "@/lib/patientcare";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export const fetchAllRegisterPatient = createAsyncThunk(
  "Users/fetchAll",
  async (filters: PatientFilter) => {
    const response = await GetFilterSearchPatient(filters);
    // this should return: { total, page, limit, data }
    return response.return;
  }
);

export interface Patient {
  profileImageUrl?: string | null;
  firstName: string;
  lastName: string;
  Patient_Medical_Record_No: string;
  mobile: string;
  email: string;
  dateOfBirth?: string | null;
  lastVisit?: string | null;
}

export interface PatientState {
  data: Patient[];
  total: number;
  loading: boolean;
  page: number;
  limit: number;
  error: string | null;
}

// ✅ strongly typed initial state
const initialState: PatientState = {
  data: [],
  total: 0,
  loading: false,
  page: 1,
  limit: 10,
  error: null,
};

const patientSlice = createSlice({
  name: "Users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllRegisterPatient.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllRegisterPatient.fulfilled, (state, action: PayloadAction<any>) => {
        state.data = action.payload.data ?? [];
        state.total = action.payload.total ?? 0;
        state.page = action.payload.page ?? 1;
        state.limit = action.payload.limit ?? 10;
        state.loading = false;
      })
      .addCase(fetchAllRegisterPatient.rejected, (state, action) => {
        state.error = action.error.message || "Error";
        state.loading = false;
      });
  },
});

export default patientSlice.reducer;
