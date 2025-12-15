// store/HospitalPrintSettingsSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetprintSetting } from "@/lib/setting";

// Module-level log: confirms slice is imported
console.log("🟣 HospitalPrintSettingsSlice loaded");

export const fetchHospitalPrintSettings = createAsyncThunk(
  "HospitalPrintSettings/fetchAll",
  async (_, thunkAPI) => {
    console.log("➡️ fetchHospitalPrintSettings DISPATCHED");

    const state: any = thunkAPI.getState();

    const profile = state.auth?.profile;
    const selectedHospital = state.hospitalSelection?.selectedHospital;

    console.log("Profile:", profile);
    console.log("Selected Hospital:", selectedHospital);

    if (!profile || !profile.user) {
      console.warn("⚠️ Profile not ready, skipping print settings fetch");
      return [];
    }
    if (!selectedHospital) {
      console.warn("⚠️ Hospital not selected, skipping print settings fetch");
      return [];
    }

    const user = profile.user;

    const userId = user.UserId;

    const organizationId = user.OrganizationId ?? user.organizationId ?? null;

    const hospitalId =
      selectedHospital.HospitalId ?? selectedHospital.hospitalId ?? null;

    if (!hospitalId || !organizationId) {
      console.warn("⚠️ Missing IDs for GetprintSetting:", {
        hospitalId,
        organizationId,
      });
      return [];
    }

    console.log("📡 Calling GetprintSetting API with:", {
      userId,
      hospitalId,
      organizationId,
    });

    try {
      const response = await GetprintSetting(
        userId,
        hospitalId,
        organizationId
      );
      console.log("✅ Print settings API response:", response);

      // most backend responses are shaped as { return: {...} }
      return response?.return ?? response ?? [];
    } catch (err) {
      console.error("❌ ERROR in fetchHospitalPrintSettings:", err);
      throw err;
    }
  }
);

// ---------------- SLICE ---------------- //

const HospitalPrintSettingsSlice = createSlice({
  name: "HospitalPrintSettings",
  initialState: {
    data: [] as any[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHospitalPrintSettings.pending, (state) => {
        console.log("⏳ Loading print settings...");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHospitalPrintSettings.fulfilled, (state, action) => {
        console.log("✅ Print settings loaded:", action.payload);
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchHospitalPrintSettings.rejected, (state, action) => {
        console.error("❌ Print settings error:", action.error);
        state.error = action.error?.message || "Error loading print settings";
        state.loading = false;
      });
  },
});

export default HospitalPrintSettingsSlice.reducer;
