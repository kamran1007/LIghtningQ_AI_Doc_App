import { GetFilterSearchappointment } from '@/lib/bookappointment';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const fetchAllAppointmentPatient = createAsyncThunk(
    'Users/fetchAll',
    async ({ page, limit }: { page: number; limit: number }) => {
      const response = await GetFilterSearchappointment(page, limit); // pass pagination args
      console.log(response)
      return response.data; // this contains: { total, page, limit, data }
    }
  );
  
  const AppointmentSlice = createSlice({
    name: 'appointments',
    initialState: {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      loading: false,
      error: null as string | null,
    },
    reducers: {},
    extraReducers: builder => {
      builder
        .addCase(fetchAllAppointmentPatient.pending, state => {
          state.loading = true;
        })
        .addCase(fetchAllAppointmentPatient.fulfilled, (state, action) => {
          state.data = action.payload.data;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
          state.loading = false;
        })
        .addCase(fetchAllAppointmentPatient.rejected, (state, action) => {
          state.error = action.error.message || 'Error';
          state.loading = false;
        });
    },
  });
  export default AppointmentSlice.reducer;

