//  store/index.ts

import { configureStore } from "@reduxjs/toolkit";
import globalLoaderReducer from "./globalLoaderSlice";
import hospitalReducer from "./hospitalSlice"; // ✅ Add this line
import hospitalUsersReducer from "./hospitalusersSlice"; // ✅ Add this line
import userReducer  from "./edituserSlice";
import patientuserReducer from "./PatientSlice"; // ✅ This is missing!
import AppointmentReducer from "./AppointmentSlice"; // ✅ Must match actual file
import authReducer from "./authSlice";
import hospitalSelectionReducer from "./HospitalBranchSelectionSlice";




export const store = configureStore({
  reducer: {
    globalLoader: globalLoaderReducer,
    hospital: hospitalReducer, 
    hospitalUsers: hospitalUsersReducer,
    user: userReducer,
    patientData: patientuserReducer,
    AppointmentData: AppointmentReducer,
    auth: authReducer,
    hospitalSelection: hospitalSelectionReducer,


  },
});

// ✅ Export RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

