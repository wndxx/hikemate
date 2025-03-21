import api from "./axiosInstance"

// Get all mountains with pagination and filtering
export const getAllMountains = async (page = 1, size = 10, direction = "asc", sort = "id", name = "") => {
  try {
    const response = await api.get(`/mountains`, {
      params: {
        page,
        size,
        direction,
        sort,
        name,
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
      return {
        success: false,
        message: response.data.message || "Failed to fetch mountains",
      }
    }
  } catch (error) {
    console.error("Error fetching mountains:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch mountains",
    }
  }
}

// Get mountain by ID
export const getMountainById = async (id) => {
  try {
    const response = await api.get(`/mountains/${id}`)

    console.log("Mountain detail API response:", response.data)

    if (response.data.status === 200) {
      return {
        success: true,
        mountain: response.data.data,
      }
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to fetch mountain details",
      }
    }
  } catch (error) {
    console.error(`Error fetching mountain with ID ${id}:`, error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch mountain details",
    }
  }
}

// Create a new mountain
export const createMountain = async (mountainData, mountainImage, basecampImages) => {
  try {
    // Create FormData for multipart/form-data submission
    const formData = new FormData()

    // Add mountain data as JSON string in a field called 'mountain'
    formData.append("mountain", JSON.stringify(mountainData))

    // Add mountain cover image
    if (mountainImage) {
      formData.append("image", mountainImage)
    }

    // Add basecamp images (multiple)
    if (basecampImages && basecampImages.length > 0) {
      for (let i = 0; i < basecampImages.length; i++) {
        formData.append("baseCampImages", basecampImages[i])
      }
    }

    const response = await api.post("/mountains", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    console.log("Create mountain response:", response.data)

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

// Update a mountain
export const updateMountain = async (mountainData, mountainImage, basecampImages) => {
  try {
    let requestData
    let headers = {}

    // If we have image files, use FormData
    if (mountainImage || (basecampImages && basecampImages.length > 0)) {
      // Create FormData for multipart/form-data submission
      const formData = new FormData()

      // Add mountain data as JSON string in a field called 'mountain'
      formData.append("mountain", JSON.stringify(mountainData))

      // Add mountain cover image if provided
      if (mountainImage) {
        formData.append("image", mountainImage)
      }

      // Add basecamp images (multiple) if provided
      if (basecampImages && basecampImages.length > 0) {
        for (let i = 0; i < basecampImages.length; i++) {
          formData.append("baseCampImages", basecampImages[i])
        }
      }

      requestData = formData
      headers = {
        "Content-Type": "multipart/form-data",
      }
    } else {
      // If no files, just send the JSON directly
      requestData = mountainData
      headers = {
        "Content-Type": "application/json",
      }
    }

    const response = await api.patch("/mountains", requestData, { headers })

    console.log("Update mountain response:", response.data)

    if (response.data.status === 201) {
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

// Delete a mountain
export const deleteMountain = async (id) => {
  try {
    const response = await api.delete(`/mountains/${id}`)

    console.log("Delete mountain response:", response.data)

    if (response.data.status === 200) {
      return {
        success: true,
        message: response.data.message || "Mountain deleted successfully",
      }
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to delete mountain",
      }
    }
  } catch (error) {
    console.error(`Error deleting mountain with ID ${id}:`, error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete mountain",
    }
  }
}

