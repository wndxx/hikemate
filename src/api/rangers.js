import api from "./axiosInstance";

// Get all rangers with pagination
export const getAllRangers = async (page = 1, size = 10, direction = "asc", sortBy = "id") => {
  try {
    const response = await api.get(`/rangers`, {
      params: { page, size, direction, sortBy },
    });

    if (response.data.status === 200) {
      return {
        success: true,
        rangers: response.data.data,
        pagination: response.data.paging,
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to fetch rangers",
      };
    }
  } catch (error) {
    console.error("Error fetching rangers:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch rangers",
    };
  }
};

// Get ranger by ID
export const getRangerById = async (id) => {
  try {
    const response = await api.get(`/rangers/${id}`);

    if (response.data.status === 200) {
      return {
        success: true,
        ranger: response.data.data,
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to fetch ranger details",
      };
    }
  } catch (error) {
    console.error(`Error fetching ranger with ID ${id}:`, error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch ranger details",
    };
  }
};
