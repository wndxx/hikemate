// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import profileReducer from "./slice/profileSlice"; // Pastikan ini di-import

// Ambil data user dari localStorage
const user = JSON.parse(localStorage.getItem("user"));

const preloadedState = {
  auth: {
    isAuthenticated: !!user,
    user: user || null,
    role: user?.role || null,
  },
  profile: {
    user: user || null, // Sesuaikan dengan initialState di profileSlice
    loading: false,
    error: null,
  },
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer, // Pastikan profileReducer ditambahkan
  },
  preloadedState,
});

export default store;