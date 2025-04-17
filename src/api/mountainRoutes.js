import api from "./axiosInstance"

// Get all mountain routes with pagination and filtering
export const getAllMountainRoutes = async (
  page = 1,
  size = 10,
  direction = "asc",
  sort = "id",
  mountainId = null,
  routeId = null,
) => {
  try {
    // For json-server, we need to use _start, _limit, _sort, _order
    const _start = (page - 1) * size
    const _limit = size

    // Build query parameters
    const params = {
      _start,
      _limit,
      _sort: sort,
      _order: direction,
    }

    // Add optional filters if provided
    if (mountainId) params.mountainId = mountainId
    if (routeId) params.routeId = routeId

    const response = await api.get("/mountain-routes", { params })

    // Get total count from headers
    const totalCount = Number.parseInt(response.headers["x-total-count"] || "0", 10)

    return {
      success: true,
      mountainRoutes: response.data || [],
      pagination: {
        page,
        totalPages: Math.ceil(totalCount / size),
        totalElements: totalCount,
        hasNext: page * size < totalCount,
        hasPrevious: page > 1,
      },
    }
  } catch (error) {
    console.error("Error fetching mountain routes:", error)
    return {
      success: false,
      message: error.message || "Failed to fetch mountain routes",
      error,
    }
  }
}

// Get mountain route by ID
export const getMountainRouteById = async (id) => {
  try {
    const response = await api.get(`/mountain-routes/${id}`)

    return {
      success: true,
      mountainRoute: response.data,
    }
  } catch (error) {
    console.error("Error fetching mountain route:", error)
    return {
      success: false,
      message: error.message || "Failed to fetch mountain route",
    }
  }
}

// Create new mountain route
export const createMountainRoute = async (mountainRouteData) => {
  try {
    const response = await api.post("/mountain-routes", mountainRouteData)

    return {
      success: true,
      message: "Mountain Route created successfully!",
      mountainRoute: response.data,
    }
  } catch (error) {
    console.error("Error creating mountain route:", error)
    return {
      success: false,
      message: error.message || "Failed to create mountain route",
      error: error,
    }
  }
}

// Delete mountain route
export const deleteMountainRoute = async (id) => {
  try {
    await api.delete(`/mountain-routes/${id}`)

    return {
      success: true,
      message: "Mountain Route deleted successfully!",
    }
  } catch (error) {
    console.error("Error deleting mountain route:", error)
    return {
      success: false,
      message: error.message || "Failed to delete mountain route",
    }
  }
}
