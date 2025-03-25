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

// Get ranger by mountain ID
export const getRangerByMountainId = async (mountainId) => {
  try {
    const response = await api.get(`/rangers/ranger-mountain/${mountainId}`);

    if (response.data.status === 200) {
      return {
        success: true,
        ranger: response.data.data, // This directly returns the ranger object
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to fetch ranger for this mountain",
      };
    }
  } catch (error) {
    console.error(`Error fetching ranger for mountain ID ${mountainId}:`, error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch ranger for this mountain",
    };
  }
};

// Delete ranger by ID
export const deleteRanger = async (id) => {
  try {
    const response = await api.delete(`/rangers/${id}`);

    if (response.data.status === 200) {
      return {
        success: true,
        message: response.data.message || "Ranger deleted successfully",
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to delete ranger",
      };
    }
  } catch (error) {
    console.error(`Error deleting ranger with ID ${id}:`, error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete ranger",
    };
  }
};
