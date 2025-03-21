import axios from "axios";

const API_BASE_URL = "http://10.10.103.80:8080/api/v1"; // Updated base URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Add timeout to prevent hanging requests
  timeout: 10000,
});

// Request interceptor to add auth token and log requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log the request for debugging
    console.log("API Request:", {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers,
    });

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors and log responses
api.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log("API Response:", {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    // Log error response
    console.error("API Error Response:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      alert("Your session has expired. Please login again.");
    }
    return Promise.reject(error);
  }
);

export default api;
