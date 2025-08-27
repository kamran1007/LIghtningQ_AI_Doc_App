import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "./storage"; // ⬅️ use safe storage, not direct "redux-persist/lib/storage"

// reducers...
import globalLoaderReducer from "./globalLoaderSlice";
import hospitalReducer from "./hospitalSlice";
import hospitalUsersReducer from "./hospitalusersSlice";
import userReducer from "./edituserSlice";
import patientuserReducer from "./PatientSlice";
import AppointmentReducer from "./AppointmentSlice";
import authReducer from "./authSlice";
import hospitalSelectionReducer from "./HospitalBranchSelectionSlice";
import hospitalAccessRightReducer from "./LoginAccessRightSlice";

const rootReducer = combineReducers({
  globalLoader: globalLoaderReducer,
  hospital: hospitalReducer,
  hospitalUsers: hospitalUsersReducer,
  user: userReducer,
  patientData: patientuserReducer,
  AppointmentData: AppointmentReducer,
  auth: authReducer,
  hospitalSelection: hospitalSelectionReducer,
  hospitalAccessRight: hospitalAccessRightReducer,
});

const persistConfig = {
  key: "lightningq_app",
  storage,
  whitelist: ["auth", "hospitalSelection", "hospitalAccessRight"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
