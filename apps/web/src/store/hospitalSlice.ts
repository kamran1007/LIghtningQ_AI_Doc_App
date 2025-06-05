// store/hospitalSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getallhospitalByUser } from '@/lib/admin';

export const fetchHospitals = createAsyncThunk('hospital/fetchAll', async () => {
  const response = await getallhospitalByUser();
  return response.return.data;
});

const hospitalSlice = createSlice({
  name: 'hospital',
  initialState: {
    data: [],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchHospitals.pending, state => {
        state.loading = true;
      })
      .addCase(fetchHospitals.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchHospitals.rejected, (state, action) => {
        state.error = action.error.message || 'Error';
        state.loading = false;
      });
  },
});

export default hospitalSlice.reducer;
