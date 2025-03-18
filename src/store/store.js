import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";

// Ambil data user dari localStorage
const user = JSON.parse(localStorage.getItem("user"));

const preloadedState = {
  auth: {
    isAuthenticated: !!user,
    user: user || null,
    role: user?.role || null, // Ambil role dari localStorage
  },
};

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState,
});

export default store;