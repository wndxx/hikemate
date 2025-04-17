import api from "./axiosInstance"

// Get all routes with pagination
export const getAllRoutes = async (page = 1, size = 10, direction = "asc", sort = "id") => {
  try {
    // For json-server, we need to use _start, _limit, _sort, _order
    const _start = (page - 1) * size
    const _limit = size

    const response = await api.get("/routes", {
      params: {
        _start,
        _limit,
        _sort: sort,
        _order: direction,
      },
    })

    // Get total count from headers
    const totalCount = Number.parseInt(response.headers["x-total-count"] || "0", 10)

    return {
      success: true,
      routes: response.data || [],
      pagination: {
        page,
        totalPages: Math.ceil(totalCount / size),
        totalElements: totalCount,
        hasNext: page * size < totalCount,
        hasPrevious: page > 1,
      },
    }
  } catch (error) {
    console.error("Error fetching routes:", error)
    return {
      success: false,
      message: error.message || "Failed to fetch routes",
      error,
    }
  }
}

// Get route by ID
export const getRouteById = async (id) => {
  try {
    const response = await api.get(`/routes/${id}`)

    return {
      success: true,
      route: response.data,
    }
  } catch (error) {
    console.error("Error fetching route:", error)
    return {
      success: false,
      message: error.message || "Failed to fetch route",
    }
  }
}

// Create new route
export const createRoute = async (routeData) => {
  try {
    const response = await api.post("/routes", routeData)

    return {
      success: true,
      message: "Route created successfully!",
      route: response.data,
    }
  } catch (error) {
    console.error("Error creating route:", error)
    return {
      success: false,
      message: error.message || "Failed to create route",
      error: error,
    }
  }
}

// Delete route
export const deleteRoute = async (id) => {
  try {
    await api.delete(`/routes/${id}`)

    return {
      success: true,
      message: "Route deleted successfully!",
    }
  } catch (error) {
    console.error("Error deleting route:", error)
    return {
      success: false,
      message: error.message || "Failed to delete route",
    }
  }
}
