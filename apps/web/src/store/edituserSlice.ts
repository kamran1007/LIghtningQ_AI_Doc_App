// store/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Slice } from "@reduxjs/toolkit";


type User = {
  UserId: number;
  Prefix: string;
  firstName: string;
  lastName: string;
  Employee_ID: string;
  mobile: string;
  gender: string;
  dateOfBirth: string;
  email: string;
  roleId: number;
  imageUrl?: string;
  SignatureOfUser?: string;
  userBranchArray?: [];
  // Add other fields as needed
};

interface UserState {
  selectedUser: User | null;
}

const initialState: UserState = {
  selectedUser: null,
};


export const edituserSlice: Slice<UserState> = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
});

export const { setSelectedUser, clearSelectedUser } = edituserSlice.actions;
export default edituserSlice.reducer;
export type { UserState };

