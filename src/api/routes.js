import axios from "axios"
import { getToken } from "../utils/auth"
import { logApiError, createErrorResponse } from "../utils/apiUtils"

const API_URL = "http://10.10.103.80:8080/api/v1"

// Get all routes with pagination
export const getAllRoutes = async (page = 1, size = 10, direction = "asc", sort = "id") => {
  try {
    const token = getToken()
    const response = await axios.get(`${API_URL}/routes`, {
      params: {
        page,
        size,
        direction,
        sort,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    console.log("Routes API response:", response.data)

    if (response.data.status === 200) {
      return {
        success: true,
        routes: response.data.data,
        pagination: response.data.paging,
      }
    } else {
      return createErrorResponse(response.data.message || "Failed to fetch routes")
    }
  } catch (error) {
    logApiError("fetching routes", error)
    return createErrorResponse(error.response?.data?.message || "Failed to fetch routes", error)
  }
}

// Get route by ID
export const getRouteById = async (id) => {
  try {
    const token = getToken()
    const response = await axios.get(`${API_URL}/routes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.data.status === 200) {
      return {
        success: true,
        route: response.data.data,
      }
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to fetch route",
      }
    }
  } catch (error) {
    console.error("Error fetching route:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch route",
    }
  }
}

// Create new route
export const createRoute = async (routeData) => {
  try {
    const token = getToken()
    const response = await axios.post(`${API_URL}/routes`, routeData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    console.log("Route creation response:", response.data)

    if (response.data.status === 201) {
      return {
        success: true,
        message: "Route created successfully!",
        route: response.data.data,
      }
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to create route",
      }
    }
  } catch (error) {
    console.error("Error creating route:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create route",
      error: error.response?.data || error.message,
    }
  }
}

// Delete route
export const deleteRoute = async (id) => {
  try {
    const token = getToken()
    const response = await axios.delete(`${API_URL}/routes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 204 || (response.data && response.data.status === 200)) {
      return {
        success: true,
        message: "Route deleted successfully!",
      }
    } else {
      return {
        success: false,
        message: response.data?.message || "Failed to delete route",
      }
    }
  } catch (error) {
    console.error("Error deleting route:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete route",
    }
  }
}

