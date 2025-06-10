// store/hospitalSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getallusers } from '@/lib/admin';

// export const fetchHospitalUsers = createAsyncThunk('Users/fetchAll', async () => {
//   const response = await getallusers();
//   console.log(response)
//   return response.return.data;
// });

// const UsersSlice = createSlice({
//   name: 'Users',
//   initialState: {
//     data: [],
//     loading: false,
//     error: null as string | null,
//   },
//   reducers: {},
//   extraReducers: builder => {
//     builder
//       .addCase(fetchHospitalUsers.pending, state => {
//         state.loading = true;
//       })
//       .addCase(fetchHospitalUsers.fulfilled, (state, action) => {
//         state.data = action.payload;
//         state.loading = false;
//       })
//       .addCase(fetchHospitalUsers.rejected, (state, action) => {
//         state.error = action.error.message || 'Error';
//         state.loading = false;
//       });
//   },
// });

export const fetchHospitalUsers = createAsyncThunk(
  'Users/fetchAll',
  async ({ page, limit }: { page: number; limit: number }) => {
    const response = await getallusers(page, limit); // pass pagination args
    console.log(response)
    return response.return; // this contains: { total, page, limit, data }
  }
);

const UsersSlice = createSlice({
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
      .addCase(fetchHospitalUsers.pending, state => {
        state.loading = true;
      })
      .addCase(fetchHospitalUsers.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.loading = false;
      })
      .addCase(fetchHospitalUsers.rejected, (state, action) => {
        state.error = action.error.message || 'Error';
        state.loading = false;
      });
  },
});
export default UsersSlice.reducer;
