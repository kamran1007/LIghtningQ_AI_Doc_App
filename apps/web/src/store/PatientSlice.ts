import { GetFilterSearchPatient } from '@/lib/patientcare';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const fetchAllRegisterPatient = createAsyncThunk(
    'Users/fetchAll',
    async ({ page, limit }: { page: number; limit: number }) => {
      const response = await GetFilterSearchPatient(page, limit); // pass pagination args
      console.log(response)
      return response.return; // this contains: { total, page, limit, data }
    }
  );
  
  const patientSlice = createSlice({
    name: 'Users',
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
        .addCase(fetchAllRegisterPatient.pending, state => {
          state.loading = true;
        })
        .addCase(fetchAllRegisterPatient.fulfilled, (state, action) => {
          state.data = action.payload.data;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
          state.loading = false;
        })
        .addCase(fetchAllRegisterPatient.rejected, (state, action) => {
          state.error = action.error.message || 'Error';
          state.loading = false;
        });
    },
  });
  export default patientSlice.reducer;

