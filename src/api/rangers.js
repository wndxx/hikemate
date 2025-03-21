import api from "./axiosInstance"

// Get all rangers
export const getAllRangers = async (page = 1, size = 10) => {
  try {
    const response = await api.get(`/rangers`, {
      params: { page, size },
    })

    return {
      success: true,
      rangers: response.data.data,
      pagination: response.data.paging,
    }
  } catch (error) {
    console.error("Error fetching rangers:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch rangers",
    }
  }
}

// Get ranger by ID
export const getRangerById = async (id) => {
  try {
    const response = await api.get(`/rangers/${id}`)

    return {
      success: true,
      ranger: response.data.data,
    }
  } catch (error) {
    console.error(`Error fetching ranger with ID ${id}:`, error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch ranger details",
    }
  }
}

