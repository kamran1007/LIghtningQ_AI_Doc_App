// store/hospitalSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRolePermissions } from "@/lib/admin";

export const fetchAccessRight = createAsyncThunk(
  "AccessRight/fetchAll",
  async () => {
    const response = await getRolePermissions();
    console.log(response);
    return response.return.data;
  }
);

const LoginAccessRightSlice = createSlice({
  name: "hospital",
  initialState: {
    data: [],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccessRight.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAccessRight.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchAccessRight.rejected, (state, action) => {
        state.error = action.error.message || "Error";
        state.loading = false;
      });
  },
});

export default LoginAccessRightSlice.reducer;
