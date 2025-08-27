// store/hospitalSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getallusers } from "@/lib/admin";

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
  "Users/fetchAll",
  async ({
    page,
    limit,
    search,
    hospitalId,
    roleId,
    organizationId,
  }: {
    page: number;
    limit: number;
    search?: string;
    hospitalId?: number | "all";
    roleId?: number | "all";
    organizationId: number;
  }) => {
    const response = await getallusers(
      page,
      limit,
      search,
      hospitalId,
      roleId,
      organizationId
    );
    return response; // this contains: { total, page, limit, data }
  }
);

const UsersSlice = createSlice({
  name: "Users",
  initialState: {
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHospitalUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHospitalUsers.fulfilled, (state, action) => {
  const payload = action.payload?.return || {};
        console.log("API response in slice:", payload);

        state.data = Array.isArray(payload.data) ? payload.data : [];
        state.total = typeof payload.total === "number" ? payload.total : 0;
        state.page = typeof payload.page === "number" ? payload.page : 1;
        state.limit = typeof payload.limit === "number" ? payload.limit : 10;
        state.loading = false;
      })

      .addCase(fetchHospitalUsers.rejected, (state, action) => {
        state.error = action.error.message || "Error";
        state.loading = false;
      });
  },
});
export default UsersSlice.reducer;
