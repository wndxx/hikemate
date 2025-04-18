import api from "./axiosInstance";
import jwtDecode from "jwt-decode"; // <-- PERUBAHAN DI SINI

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    const decoded = jwtDecode(response.data.data.token); // <-- Tetap sama penggunaannya

    return {
      success: true,
      userData: {
        id: decoded.userAccountId,
        loggedInId: decoded.userLoggedInId,
        name: decoded.name,
        email: decoded.email,
        role: decoded.roles,
      },
      token: response.data.data.token
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Login failed",
      status: error.response?.status
    };
  }
};

export const registerUser = async (name, phone, email, password) => {
  try {
    const formData = new FormData();
    formData.append("hiker", JSON.stringify({ name, phone, email, password }));

    const response = await api.post("/auth/register", formData, {
      headers: { "Content-Type": "multipart/form-data" } // <-- Typo diperbaiki
    });

    return {
      success: response.data.status === 201,
      message: response.data.message,
      ...response.data.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Registration failed",
      status: error.response?.status
    };
  }
};