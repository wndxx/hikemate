import api from "./axiosInstance"

// Login function
export const login = async (credentials) => {
  try {
    // For json-server, we need to get users and check credentials manually
    const response = await api.get("/users", {
      params: {
        email: credentials.email,
      },
    })

    if (response.data && response.data.length > 0) {
      const user = response.data[0]

      // In a real app, you would hash the password and compare
      // For this demo, we'll just check if the passwords match
      if (user.password === credentials.password) {
        // Create a token (in a real app, this would be a JWT)
        const token = `dummy-token-${Date.now()}`

        return {
          success: true,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role || "user",
            loggedInId: user.id, // For compatibility with existing code
          },
          token,
        }
      }
    }

    return {
      success: false,
      message: "Invalid email or password",
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      message: error.message || "Login failed",
    }
  }
}

// Register function
export const register = async (userData) => {
  try {
    // Check if user with this email already exists
    const checkResponse = await api.get("/users", {
      params: {
        email: userData.email,
      },
    })

    if (checkResponse.data && checkResponse.data.length > 0) {
      return {
        success: false,
        message: "Email already in use",
      }
    }

    // Create new user
    const response = await api.post("/users", {
      ...userData,
      id: Date.now().toString(), // Generate a unique ID
      role: "user", // Default role
    })

    return {
      success: true,
      user: response.data,
      message: "Registration successful",
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      message: error.message || "Registration failed",
    }
  }
}

// Logout function (client-side only)
export const logout = () => {
  // Clear local storage
  localStorage.removeItem("token")
  localStorage.removeItem("user")

  return {
    success: true,
    message: "Logout successful",
  }
}

// Check if user is authenticated
export const checkAuth = () => {
  const token = localStorage.getItem("token")
  const userStr = localStorage.getItem("user")

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr)
      return {
        success: true,
        user,
        token,
      }
    } catch (error) {
      console.error("Error parsing user data:", error)
    }
  }

  return {
    success: false,
    message: "Not authenticated",
  }
}
