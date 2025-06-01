//  store/index.ts

import { configureStore } from "@reduxjs/toolkit";
import globalLoaderReducer from "./globalLoaderSlice";

export const store = configureStore({
  reducer: {
    globalLoader: globalLoaderReducer,
  },
});

// ✅ Export RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
