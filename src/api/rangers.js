import api from "./axiosInstance"

// Get all rangers with pagination
export const getAllRangers = async (page = 1, size = 10, direction = "asc", sortBy = "id") => {
  try {
    // Calculate pagination parameters for json-server
    const _start = (page - 1) * size
    const _limit = size
    const _sort = sortBy
    const _order = direction

    const response = await api.get("/rangers", {
      params: {
        _start,
        _limit,
        _sort,
        _order,
      },
    })

    // Get total count from headers
    const totalCount = Number.parseInt(response.headers["x-total-count"] || "0", 10)

    return {
      success: true,
      rangers: response.data,
      pagination: {
        page,
        totalPages: Math.ceil(totalCount / size),
        totalElements: totalCount,
        hasNext: page * size < totalCount,
        hasPrevious: page > 1,
      },
    }
  } catch (error) {
    console.error("Error fetching rangers:", error)
    return {
      success: false,
      message: error.message || "Failed to fetch rangers",
    }
  }
}

// Get ranger by ID
export const getRangerById = async (id) => {
  try {
    const response = await api.get(`/rangers/${id}`)

    return {
      success: true,
      ranger: response.data,
    }
  } catch (error) {
    console.error(`Error fetching ranger with ID ${id}:`, error)
    return {
      success: false,
      message: error.message || "Failed to fetch ranger details",
    }
  }
}

// Get ranger by mountain ID
export const getRangerByMountainId = async (mountainId) => {
  try {
    const response = await api.get("/rangers", {
      params: { mountain_id: mountainId },
    })

    if (response.data && response.data.length > 0) {
      return {
        success: true,
        ranger: response.data[0], // Return the first ranger for this mountain
      }
    } else {
      return {
        success: false,
        message: "No ranger found for this mountain",
      }
    }
  } catch (error) {
    console.error(`Error fetching ranger for mountain ID ${mountainId}:`, error)
    return {
      success: false,
      message: error.message || "Failed to fetch ranger for this mountain",
    }
  }
}

// Delete ranger by ID
export const deleteRanger = async (id) => {
  try {
    await api.delete(`/rangers/${id}`)

    return {
      success: true,
      message: "Ranger deleted successfully",
    }
  } catch (error) {
    console.error(`Error deleting ranger with ID ${id}:`, error)
    return {
      success: false,
      message: error.message || "Failed to delete ranger",
    }
  }
}
