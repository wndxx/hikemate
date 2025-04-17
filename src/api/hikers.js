import api from "./axiosInstance"

// Get all hikers with pagination
export const getAllHikers = async (page = 1, size = 10) => {
  try {
    // For json-server, we need to use _start, _limit
    const _start = (page - 1) * size
    const _limit = size

    const response = await api.get("/users", {
      params: {
        _start,
        _limit,
      },
    })

    // Get total count from headers
    const totalCount = Number.parseInt(response.headers["x-total-count"] || "0", 10)

    return {
      success: true,
      hikers: response.data,
      pagination: {
        page,
        totalPages: Math.ceil(totalCount / size),
        totalElements: totalCount,
        hasNext: page * size < totalCount,
        hasPrevious: page > 1,
      },
    }
  } catch (error) {
    console.error("Error fetching hikers:", error)
    return {
      success: false,
      message: error.message || "Failed to fetch hikers",
    }
  }
}

// Get hiker by ID
export const getHikerById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`)

    return {
      success: true,
      hiker: response.data,
    }
  } catch (error) {
    console.error(`Error fetching hiker with ID ${id}:`, error)
    return {
      success: false,
      message: error.message || "Failed to fetch hiker details",
    }
  }
}
