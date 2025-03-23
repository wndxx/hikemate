import axios from "axios"

const API_BASE_URL = "http://10.10.103.80:8080/api/v1" // Updated base URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Increase timeout to prevent timeout errors for large file uploads
  timeout: 30000, // 30 seconds
})

// Improve the request interceptor to better handle authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log("Adding auth token to request:", config.url)
    } else {
      console.warn("No auth token found for request:", config.url)
    }

    // For multipart/form-data requests, let axios set the content-type with boundary
    if (config.data instanceof FormData) {
      // Remove content-type to let the browser set it with the correct boundary
      delete config.headers["Content-Type"]
    }

    // Log the request for debugging
    console.log("API Request:", {
      url: config.url,
      method: config.method,
      data: config.data instanceof FormData ? "FormData (not shown)" : config.data,
      headers: { ...config.headers, Authorization: config.headers.Authorization ? "Bearer [TOKEN]" : undefined },
    })

    return config
  },
  (error) => {
    console.error("Request Error:", error)
    return Promise.reject(error)
  },
)

// Improve the response interceptor to better handle auth errors
api.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log("API Response:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    })
    return response
  },
  (error) => {
    // Enhanced error logging
    console.error("API Error Response:", {
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
      console.error("Permission denied (403 Forbidden). User may not have required permissions.")
    }

    return Promise.reject(error)
  },
)

export default api