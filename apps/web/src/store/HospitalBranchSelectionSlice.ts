// store/HospitalBranchSelectionSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "./index";

export interface HospitalState {
  selectedHospital: any | null;  // ⬅️ clearer name
}

const initialState: HospitalState = {
  selectedHospital: null,
};

const hospitalSlice = createSlice({
  name: "hospitalSelection",
  initialState,
  reducers: {
    setSelectedHospital: (state, action: PayloadAction<any>) => {
      state.selectedHospital = action.payload;
    },
    clearSelectedHospital: (state) => {
      state.selectedHospital = null;
    },
  },
});

export const { setSelectedHospital, clearSelectedHospital } = hospitalSlice.actions;

export const loadHospitalFromStorage = () => (dispatch: AppDispatch) => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("selectedHospital"); // keep consistent
    if (saved) {
      dispatch(setSelectedHospital(JSON.parse(saved)));
    }
  }
};

export default hospitalSlice.reducer;
