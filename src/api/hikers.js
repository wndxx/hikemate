import api from "./axiosInstance"

// Get all hikers with pagination
export const getAllHikers = async (page = 1, size = 10) => {
  try {
    const response = await api.get(`/hikers`, {
      params: { page, size },
    })

    console.log("Hikers API response:", response.data)

    if (response.data.status === 200) {
      return {
        success: true,
        hikers: response.data.data,
        pagination: response.data.paging,
      }
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to fetch hikers",
      }
    }
  } catch (error) {
    console.error("Error fetching hikers:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch hikers",
    }
  }
}

// Get hiker by ID
export const getHikerById = async (id) => {
  try {
    const response = await api.get(`/hikers/${id}`)

    console.log("Hiker detail API response:", response.data)

    if (response.data.status === 200) {
      return {
        success: true,
        hiker: response.data.data,
      }
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to fetch hiker details",
      }
    }
  } catch (error) {
    console.error(`Error fetching hiker with ID ${id}:`, error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch hiker details",
    }
  }
}

