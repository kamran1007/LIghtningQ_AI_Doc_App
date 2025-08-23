// hospitalSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const HospitalBranchSelection = createSlice({
  name: "hospital",
  initialState: {
    selectedHospital: null,
  },
  reducers: {
    setSelectedHospital: (state, action) => {
      state.selectedHospital = action.payload;
      localStorage.setItem("selectedHospital", JSON.stringify(action.payload));
    },
    loadHospitalFromStorage: (state) => {
      const stored = localStorage.getItem("selectedHospital");
      if (stored) {
        state.selectedHospital = JSON.parse(stored);
      }
    },
  },
});

export const { setSelectedHospital, loadHospitalFromStorage } = HospitalBranchSelection.actions;
export default HospitalBranchSelection.reducer;
