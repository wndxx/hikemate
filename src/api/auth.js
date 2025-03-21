import api from "./axiosInstance";

// Login user
export const loginUser = async (email, password) => {
  try {
    // Make sure we're sending the exact format the server expects
    const requestData = {
      email,
      password,
    };

    console.log("Login request data:", requestData);

    const response = await api.post("/auth/login", requestData);

    if (response.data.status === 200) {
      const { data } = response.data;

      // Store token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.userAccountId,
          loggedInId: data.userLoggedInId,
          name: data.name,
          email: data.name, // Using email as name based on the response
          role: data.role,
        })
      );

      // Return the user data and token
      return {
        success: true,
        userData: {
          id: data.userAccountId,
          loggedInId: data.userLoggedInId,
          name: data.name,
          email: data.name, // Using email as name based on the response
          role: data.role,
        },
        token: data.token,
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Login failed",
      };
    }
  } catch (error) {
    console.error("Login error:", error);

    // Provide more detailed error information
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Server error",
      status: error.response?.status,
      error: error,
    };
  }
};

// Register user
export const registerUser = async (name, phone, email, password) => {
  try {
    // Make sure we're sending the exact format the server expects
    const requestData = {
      name,
      phone,
      email,
      password,
    };

    console.log("Register request data:", requestData);

    const response = await api.post("/auth/register", requestData);

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
