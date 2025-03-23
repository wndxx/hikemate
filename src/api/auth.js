import api from "./axiosInstance";
import { jwtDecode } from "jwt-decode";
// import { useDispatch } from "react-redux";
// import { loginSuccess } from "../redux/authSlice";

// Login user
export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const userCredential = jwtDecode(response.data.data.token);
    if (response.status === 200) {
      return {
        success: true,
        userData: {
          id: userCredential.userAccountId,
          loggedInId: userCredential.userLoggedInId,
          name: userCredential.name,
          email: userCredential.email,
          role: userCredential.roles,
        },
        token: response.data.data.token,
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Login failed",
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "An error occurred. Please try again.",
      status: error.response?.status || 500,
      error: error.response?.data,
    };
  }
};

// Register user
export const registerUser = async (name, phone, email, password) => {
  try {
    // Make sure we're sending the exact format the server expects
    var formData = new FormData();
    const requestData = {
      name: name,
      phone: phone,
      email: email,
      password: password,
    };
    formData.append("hiker", JSON.stringify(requestData));

    console.log("Register request data:", requestData);
    const headers = {
      "Content-Type": 'Content-Type": "multipart/form-data',
    };

    const response = await api({
      url: "/auth/register",
      method: "post",
      data: formData,
      headers: headers,
    });

    if (response.data.status === 201) {
      return {
        success: true,
        message: response.data.message,
        userId: response.data.data.userId,
        roles: response.data.data.roles,
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Registration failed",
      };
    }
  } catch (error) {
    console.error("Registration error:", error);

    // Provide more detailed error information
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Server error",
      status: error.response?.status,
      error: error,
    };
  }
};