// store/globalLoaderSlice.ts
import { createSlice } from "@reduxjs/toolkit";

export interface GlobalLoaderState {
  isLoading: boolean;
}

const initialState: GlobalLoaderState = {
  isLoading: false,
};

const globalLoaderSlice = createSlice({
  name: "globalLoader",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
  },
});

export const { startLoading, stopLoading } = globalLoaderSlice.actions;
export default globalLoaderSlice.reducer;
