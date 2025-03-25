import axios from "axios"
import { getToken } from "../utils/auth"
import { logApiError, createErrorResponse } from "../utils/apiUtils"

const API_URL = "http://10.10.103.80:8080/api/v1"

// Get all mountains with pagination
export const getAllMountains = async (page = 1, size = 10, direction = "asc", sort = "id", name = "") => {
  try {
    const token = localStorage.getItem("token")
    console.log(
      `Fetching mountains with params: page=${page}, size=${size}, direction=${direction}, sort=${sort}, name=${name}`,
    )

    const response = await axios.get(`${API_URL}/mountains`, {
      params: {
        page, // Keep as 1-based indexing as expected by the API
        size,
        direction,
        sort,
        name,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    console.log("Mountains API response:", response.data)

    if (response.data.status === 200) {
      return {
        success: true,
        mountains: response.data.data,
        pagination: response.data.paging,
      }
    } else {
      return createErrorResponse(response.data.message || "Failed to fetch mountains")
    }
  } catch (error) {
    logApiError("fetching mountains", error)
    return createErrorResponse(error.response?.data?.message || "Failed to fetch mountains", error)
  }
}

// Get mountain by ID
export const getMountainById = async (id) => {
  try {
    const token = getToken()
    const response = await axios.get(`${API_URL}/mountains/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.data.status === 200) {
      return {
        success: true,
        mountain: response.data.data,
      }
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to fetch mountain",
      }
    }
  } catch (error) {
    console.error("Error fetching mountain:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch mountain",
    }
  }
}

// Create new mountain with proper route handling
export const createMountain = async (mountainData, mountainImage, basecampImages) => {
  try {
    const token = getToken()

    // Create FormData for file uploads
    const formData = new FormData()

    // Add mountain data as JSON string
    formData.append("mountain", JSON.stringify(mountainData))

    // Add mountain cover image if provided
    if (mountainImage) {
      formData.append("image", mountainImage)
    }

    // Add basecamp images if provided
    if (basecampImages && basecampImages.length > 0) {
      basecampImages.forEach((image) => {
        formData.append("base_camp_image", image)
      })
    }

    // Log the FormData entries for debugging
    console.log("FormData entries:")
    for (const pair of formData.entries()) {
      if (pair[0] === "mountain") {
        console.log(`${pair[0]}: ${pair[1]}`)
      } else {
        console.log(`${pair[0]}: [File]`)
      }
    }

    const response = await axios.post(`${API_URL}/mountains`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })

    console.log("Mountain creation response:", response.data)

    if (response.data.status === 201) {
      return {
        success: true,
        message: "Mountain created successfully!",
        mountain: response.data.data,
      }
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to create mountain",
      }
    }
  } catch (error) {
    console.error("Error creating mountain:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create mountain",
      error: error.response?.data || error.message,
    }
  }
}

// Update mountain - Changed to use PATCH method
export const updateMountain = async (mountainData, coverImage, basecampImages) => {
  try {
    const token = getToken()
    const formData = new FormData()

    // Format mountain routes properly if they exist
    if (mountainData.mountainRoutes && mountainData.mountainRoutes.length > 0) {
      // Ensure each route has the proper structure
      mountainData.mountainRoutes = mountainData.mountainRoutes.map((route) => {
        // If route is just an ID, convert to proper object
        if (typeof route === "object" && route.id) {
          return { routeId: route.id }
        }
        return route
      })
    }

    // Add mountain data as JSON string
    formData.append("mountain", JSON.stringify(mountainData))

    // Add cover image if provided
    if (coverImage) {
      formData.append("image", coverImage)
    }

    // Add basecamp images if provided
    if (basecampImages && basecampImages.length > 0) {
      basecampImages.forEach((image) => {
        formData.append("base_camp_image", image)
      })
    }

    // Changed from POST to PATCH
    const response = await axios.patch(`${API_URL}/mountains/${mountainData.id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })

    console.log("Mountain update response:", response.data)

    if (response.data.status === 200) {
      return {
        success: true,
        message: "Mountain updated successfully!",
        mountain: response.data.data,
      }
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to update mountain",
      }
    }
  } catch (error) {
    console.error("Error updating mountain:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update mountain",
      error: error.response?.data || error.message,
    }
  }
}

// Delete mountain
export const deleteMountain = async (id) => {
  try {
    const token = getToken()
    const response = await axios.delete(`${API_URL}/mountains/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.data.status === 200) {
      return {
        success: true,
        message: "Mountain deleted successfully!",
      }
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to delete mountain",
      }
    }
  } catch (error) {
    console.error("Error deleting mountain:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete mountain",
    }
  }
}