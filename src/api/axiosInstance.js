import axios from "axios"
import { getToken } from "../utils/auth"
import API_CONFIG from "./config"

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
})

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // For multipart/form-data requests, let axios set the content-type with boundary
    if (config.data instanceof FormData) {
      // Remove content-type to let the browser set it with the correct boundary
      delete config.headers["Content-Type"]
    }

    // Log the full URL being requested for debugging
    //console.log("Full request URL:", `${config.baseURL}${config.url}`)

    // Log the request for debugging
    /*console.log("API Request:", {
      url: config.url,
      method: config.method,
      data: config.data instanceof FormData ? "FormData (not shown)" : config.data,
      headers: { ...config.headers, Authorization: config.headers.Authorization ? "Bearer [TOKEN]" : undefined },
    })*/

    return config
  },
  (error) => {
    console.error("Request Error:", error)
    return Promise.reject(error)
  },
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Log successful response
    /*console.log("API Response:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    })*/
    return response
  },
  (error) => {
    // Enhanced error logging
    console.error("API Error:", error)
    /*console.error("API Error Response:", {
      url: error.config?.url,
      method: error.config?.method,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    })

    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
      alert("Your session has expired. Please login again.")
    } else if (error.response && error.response.status === 403) {
      // Forbidden - user doesn't have permission
      console.error("Permission denied (403 Forbidden). User may not have required permissions.", error.response)
      // Don't redirect here, just log the error
    } else if (error.response && error.response.status === 404) {
      // Not found - handle specific 404 errors
      if (error.response.data?.message === "Ranger Not Found") {
        console.error("The ranger ID provided does not exist in the system.")
      } else if (error.response.data?.message === "Route not found!") {
        console.error("API endpoint not found:", error.config.url)
      }
    } else if (error.response && error.response.status === 500) {
      // Server error - log detailed information
      console.error("Server error (500):", error.response.data)
      console.error("Request that caused the error:", {
        url: error.config.url,
        method: error.config.method,
        data: error.config.data,
      })
    }*/

    return Promise.reject(error)
  },
)

// Add a utility function to check if the API is available
export const checkApiAvailability = async () => {
  try {
    // Try to make a simple request to check if the API is available
    const response = await axios.get(`${API_CONFIG.baseURL}/health`, { timeout: 5000 })
    return response.status === 200
  } catch (error) {
    console.error("API availability check failed:", error)
    return false
  }
}

// Add a function to check if the user has the HIKER role
export const hasHikerRole = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"))
    return (
      user &&
      user.role &&
      (user.role.includes("HIKER") || (Array.isArray(user.role) && user.role.some((r) => r === "HIKER")))
    )
  } catch (error) {
    console.error("Error checking user role:", error)
    return false
  }
}

export default api
