//  store/index.ts

import { configureStore } from "@reduxjs/toolkit";
import globalLoaderReducer from "./globalLoaderSlice";
import hospitalReducer from "./hospitalSlice"; // ✅ Add this line


export const store = configureStore({
  reducer: {
    globalLoader: globalLoaderReducer,
    hospital: hospitalReducer, 
  },
});

// ✅ Export RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

