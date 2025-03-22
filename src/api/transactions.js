import api from "./axiosInstance";

/**
 * Get all transactions with pagination
 * @param {number} page - Current page number (default: 1)
 * @param {number} size - Number of items per page (default: 10)
 * @param {string} direction - Sorting direction (default: "asc")
 * @param {string} sortBy - Field to sort by (default: "id")
 * @returns {Object} - Returns an object containing success status, transactions data, and pagination info
 */
export const getAllTransactions = async (page = 1, size = 10, direction = "asc", sortBy = "id") => {
  try {
    const response = await api.get(`/transactions`, {
      params: { page, size, direction, sortBy },
    });

    if (response.data.status === 200) {
      return {
        success: true,
        transactions: response.data.data,
        pagination: response.data.paging,
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to fetch transactions",
      };
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch transactions",
    };
  }
};

/**
 * Get transaction by ID
 * @param {string} id - Transaction ID
 * @returns {Object} - Returns an object containing success status and transaction details
 */
export const getTransactionById = async (id) => {
  try {
    const response = await api.get(`/transactions/${id}`);

    if (response.data.status === 200) {
      return {
        success: true,
        transaction: response.data.data[0], // Ambil data pertama dari array
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to fetch transaction details",
      };
    }
  } catch (error) {
    console.error(`Error fetching transaction with ID ${id}:`, error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch transaction details",
    };
  }
};