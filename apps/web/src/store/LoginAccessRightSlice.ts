// store/LoginAccessRightSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRolePermissions } from "@/lib/admin";

export const fetchAccessRight = createAsyncThunk(
  "AccessRight/fetchAll",
  async (_, thunkAPI) => {
    const state: any = thunkAPI.getState();
    const profile = state.auth.profile;
    const selectedHospital = state.hospitalSelection?.selectedHospital;

    console.log("Profile in fetchAccessRight:", profile);
    console.log("Selected Hospital in fetchAccessRight:", selectedHospital);

    // safely extract values from profile.user
    const user = profile?.user || {};
    const roleId = user.RoleId ?? user.roleId;
    const userId = user.UserId ?? user.userId;
    const orgId = user.OrganizationId ?? user.organizationId;
    const hospitalId =
      selectedHospital?.HospitalId ?? selectedHospital?.hospitalId;

    if (!roleId || !userId || !hospitalId || !orgId) {
      console.warn("⚠️ Missing required IDs for getRolePermissions", {
        roleId,
        userId,
        hospitalId,
        orgId,
      });
      return [];
    }

    const response = await getRolePermissions(
      roleId,
      userId,
      hospitalId,
      orgId
    );

    return response?.return || [];
  }
);

const LoginAccessRightSlice = createSlice({
  name: "hospitalAccessRight",
  initialState: {
    data: [] as any[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccessRight.pending, (state) => {
        state.loading = true;
        state.error = null;
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
