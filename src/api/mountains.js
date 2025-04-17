import api from "./axiosInstance"

// Get all mountains with pagination
export const getAllMountains = async (page = 1, size = 10, direction = "asc", sort = "id", name = "") => {
  try {
    // Calculate pagination parameters for json-server
    const _start = (page - 1) * size
    const _limit = size
    const _sort = sort
    const _order = direction

    // Build query parameters
    const params = {
      _start,
      _limit,
      _sort,
      _order,
    }

    // Add name filter if provided
    if (name) {
      params.name_like = name
    }

    const response = await api.get("/mountains", { params })

    // Get total count from headers
    const totalCount = Number.parseInt(response.headers["x-total-count"] || "0", 10)

    return {
      success: true,
      mountains: response.data,
      pagination: {
        page,
        totalPages: Math.ceil(totalCount / size),
        totalElements: totalCount,
        hasNext: page * size < totalCount,
        hasPrevious: page > 1,
      },
    }
  } catch (error) {
    console.error("Error fetching mountains:", error)
    return {
      success: false,
      message: error.message || "Failed to fetch mountains",
      error,
    }
  }
}

// Get mountain by ID
export const getMountainById = async (id) => {
  try {
    const response = await api.get(`/mountains/${id}`)

    return {
      success: true,
      mountain: response.data,
    }
  } catch (error) {
    console.error("Error fetching mountain:", error)
    return {
      success: false,
      message: error.message || "Failed to fetch mountain",
    }
  }
}

// Create new mountain
export const createMountain = async (mountainData, mountainImage, basecampImages) => {
  try {
    // For json-server, we'll just send the mountain data
    // In a real app with file uploads, you'd use FormData
    const response = await api.post("/mountains", mountainData)

    return {
      success: true,
      message: "Mountain created successfully!",
      mountain: response.data,
    }
  } catch (error) {
    console.error("Error creating mountain:", error)
    return {
      success: false,
      message: error.message || "Failed to create mountain",
      error: error,
    }
  }
}

// Update mountain
export const updateMountain = async (mountainData) => {
  try {
    const response = await api.put(`/mountains/${mountainData.id}`, mountainData)

    return {
      success: true,
      message: "Mountain updated successfully!",
      mountain: response.data,
    }
  } catch (error) {
    console.error("Error updating mountain:", error)
    return {
      success: false,
      message: error.message || "Failed to update mountain",
    }
  }
}

// Delete mountain
export const deleteMountain = async (id) => {
  try {
    await api.delete(`/mountains/${id}`)

    return {
      success: true,
      message: "Mountain deleted successfully!",
    }
  } catch (error) {
    console.error("Error deleting mountain:", error)
    return {
      success: false,
      message: error.message || "Failed to delete mountain",
    }
  }
}
