import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    user: null,
    role: null, // Tambahkan field role
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = action.payload.role; // Simpan role dari payload
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null; // Reset role saat logout
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;