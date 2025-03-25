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

// Update the createMountain function to use the correct form data keys for images
export const createMountain = async (mountainData, coverImage, basecampImages = []) => {
  try {
    const formData = new FormData()

    // Add mountain data as JSON
    formData.append("mountain", JSON.stringify(mountainData))

    // Add cover image with the correct key "image"
    if (coverImage) {
      formData.append("image", coverImage)
    }

    // Add basecamp images with the correct key "base_camp_image"
    if (basecampImages && basecampImages.length > 0) {
      for (let i = 0; i < basecampImages.length; i++) {
        formData.append("base_camp_image", basecampImages[i])
      }
    }

    const response = await axios.post(`${API_URL}/mountains`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    })

    if (response.data.status === 201) {
      return {
        success: true,
        mountain: response.data.data,
        message: response.data.message || "Mountain created successfully",
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
    }
  }
}

// Update the updateMountain function to use the correct form data keys for images
export const updateMountain = async (mountainData, coverImage, basecampImages = []) => {
  try {
    const formData = new FormData()

    // Add mountain data as JSON
    formData.append("mountain", JSON.stringify(mountainData))

    // Add cover image with the correct key "image"
    if (coverImage) {
      formData.append("image", coverImage)
    }

    // Add basecamp images with the correct key "base_camp_image"
    if (basecampImages && basecampImages.length > 0) {
      for (let i = 0; i < basecampImages.length; i++) {
        formData.append("base_camp_image", basecampImages[i])
      }
    }

    const response = await axios.post(`${API_URL}/mountains/${mountainData.id}`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    })

    if (response.data.status === 200) {
      return {
        success: true,
        mountain: response.data.data,
        message: response.data.message || "Mountain updated successfully",
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

