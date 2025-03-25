import axios from "axios"
import { getToken } from "../utils/auth"
import { logApiError, createErrorResponse } from "../utils/apiUtils"

const API_URL = "http://10.10.103.80:8080/api/v1"

// Get all mountain routes with pagination
export const getAllMountainRoutes = async (page = 1, size = 10, direction = "asc", sort = "id") => {
  try {
    const token = getToken()
    const response = await axios.get(`${API_URL}/mountain-routes`, {
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

    console.log("Mountain Routes API response:", response.data)

    if (response.data.status === 200) {
      return {
        success: true,
        mountainRoutes: response.data.data,
        pagination: response.data.paging,
      }
    } else {
      return createErrorResponse(response.data.message || "Failed to fetch mountain routes")
    }
  } catch (error) {
    logApiError("fetching mountain routes", error)
    return createErrorResponse(error.response?.data?.message || "Failed to fetch mountain routes", error)
  }
}

// Get mountain route by ID
export const getMountainRouteById = async (id) => {
  try {
    const token = getToken()
    const response = await axios.get(`${API_URL}/mountain-routes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.data.status === 200) {
      return {
        success: true,
        mountainRoute: response.data.data,
      }
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to fetch mountain route",
      }
    }
  } catch (error) {
    console.error("Error fetching mountain route:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch mountain route",
    }
  }
}

// Create new mountain route
export const createMountainRoute = async (mountainRouteData) => {
  try {
    const token = getToken()
    const response = await axios.post(`${API_URL}/mountain-routes`, mountainRouteData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    console.log("Mountain Route creation response:", response.data)

    if (response.data.status === 201) {
      return {
        success: true,
        message: "Mountain Route created successfully!",
        mountainRoute: response.data.data,
      }
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to create mountain route",
      }
    }
  } catch (error) {
    console.error("Error creating mountain route:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create mountain route",
      error: error.response?.data || error.message,
    }
  }
}

// Delete mountain route
export const deleteMountainRoute = async (id) => {
  try {
    const token = getToken()
    const response = await axios.delete(`${API_URL}/mountain-routes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 204 || (response.data && response.data.status === 200)) {
      return {
        success: true,
        message: "Mountain Route deleted successfully!",
      }
    } else {
      return {
        success: false,
        message: response.data?.message || "Failed to delete mountain route",
      }
    }
  } catch (error) {
    console.error("Error deleting mountain route:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete mountain route",
    }
  }
}