// store/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "./index";
import { getProfile } from "@/lib/action";

export interface AuthState {
  user: any | null; // from session / token decode
  profile: any | null; // from fetchUserProfile
}

const initialState: AuthState = {
  user: null,
  profile: null,
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
    clearUser: (state) => {
      state.user = null;
      state.profile = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_user");
        localStorage.removeItem("selectedHospital"); 
        sessionStorage.clear(); 
      }
    },
  },
});

export const { setUser, setProfile, clearUser } = authSlice.actions;

// ✅ Thunk: load from localStorage
export const loadAuthFromStorage = () => (dispatch: AppDispatch) => {
  if (typeof window !== "undefined") {
    const savedUser = localStorage.getItem("auth_user");
    if (savedUser) {
      dispatch(setUser(JSON.parse(savedUser)));
    }
  }
};

// ✅ Thunk: fetch profile from API
export const fetchUserProfile = () => async (dispatch: AppDispatch) => {
  try {
    const res = await getProfile();

    console.log("fetchUserProfile → raw response:", res);

    // if your API returns `{ user: {...} }`
    if (res?.user) {
      dispatch(setProfile(res.user));
    }
    // if your API already returns profile object
    else if (res) {
      dispatch(setProfile(res));
    }
  } catch (err) {
    console.error("❌ Failed to fetch profile:", err);
  }
};

export default authSlice.reducer;
