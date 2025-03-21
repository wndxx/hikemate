// Direct API call for login - alternative approach
export const loginDirectly = async (email, password) => {
  try {
    // Try with a direct fetch call to rule out axios issues
    const response = await fetch("http://10.10.103.80:8080/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("Direct login response:", data);

    if (data.status === 200) {
      return {
        success: true,
        userData: {
          id: data.data.userAccountId,
          loggedInId: data.data.userLoggedInId,
          name: data.data.name,
          email: data.data.name,
          role: data.data.role,
        },
        token: data.data.token,
      };
    } else {
      return {
        success: false,
        message: data.message || "Login failed",
      };
    }
  } catch (error) {
    console.error("Direct login error:", error);
    return {
      success: false,
      message: error.message || "Server error",
    };
  }
};

// Direct API call for registration - alternative approach
export const registerDirectly = async (name, phone, email, password) => {
  try {
    const response = await fetch("http://10.10.103.80:8080/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, phone, email, password }),
    });

    const data = await response.json();
    console.log("Direct register response:", data);

    if (data.status === 201) {
      return {
        success: true,
        message: data.message,
        userId: data.data.userId,
        roles: data.data.roles,
      };
    } else {
      return {
        success: false,
        message: data.message || "Registration failed",
      };
    }
  } catch (error) {
    console.error("Direct register error:", error);
    return {
      success: false,
      message: error.message || "Server error",
    };
  }
};
