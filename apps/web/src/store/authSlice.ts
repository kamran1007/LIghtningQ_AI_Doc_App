// store/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "./index";
import { getProfile } from "@/lib/action";

export interface AuthState {
  user: any | null; 
  profile: any | null;
  accessToken: string | null;   // ✅ Add
  refreshToken: string | null;  // ✅ Add
}

const initialState: AuthState = {
  user: null,
  profile: null,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_user", JSON.stringify(action.payload));
      }
    },
    setProfile: (state, action: PayloadAction<any>) => {
      state.profile = action.payload;
    },
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      if (typeof window !== "undefined") {
        localStorage.setItem("auth_tokens", JSON.stringify(action.payload));
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.profile = null;
      state.accessToken = null;
      state.refreshToken = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_tokens");
        localStorage.removeItem("selectedHospital");
        sessionStorage.clear();
      }
    },
  },
});

export const { setUser, setProfile, setTokens, clearUser } = authSlice.actions;
export default authSlice.reducer;

// ✅ Load tokens on app init
export const loadAuthFromStorage = () => (dispatch: AppDispatch) => {
  if (typeof window !== "undefined") {
    const savedUser = localStorage.getItem("auth_user");
    if (savedUser) {
      dispatch(setUser(JSON.parse(savedUser)));
    }

    const savedTokens = localStorage.getItem("auth_tokens");
    if (savedTokens) {
      dispatch(setTokens(JSON.parse(savedTokens)));
    }
  }
};

export const fetchUserProfile = () => async (dispatch: AppDispatch) => {
  try {
    const res = await getProfile();
    if (res?.user) {
      dispatch(setProfile(res.user));
    } else if (res) {
      dispatch(setProfile(res));
    }
  } catch (err) {
    console.error("❌ Failed to fetch profile:", err);
  }
};
