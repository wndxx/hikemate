import api from "./axiosInstance"
import { jwtDecode } from "jwt-decode"

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
    })

    if (response.data.status === 200) {
      return {
        success: true,
        transactions: response.data.data,
        pagination: response.data.paging,
      }
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to fetch transactions",
      }
    }
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch transactions",
    }
  }
}

/**
 * Get transaction by ID
 * @param {string} id - Transaction ID
 * @returns {Object} - Returns an object containing success status and transaction details
 */
export const getTransactionById = async (id) => {
  try {
    const response = await api.get(`/transactions/${id}`)

    if (response.data.status === 200) {
      return {
        success: true,
        transaction: response.data.data[0], // Ambil data pertama dari array
      }
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to fetch transaction details",
      }
    }
  } catch (error) {
    console.error(`Error fetching transaction with ID ${id}:`, error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch transaction details",
    }
  }
}

/**
 * Format date to the required format: yyyy-MM-dd HH:mm:ss
 * @param {string} dateString - Date string to format
 * @returns {string} - Formatted date string
 */
const formatDateWithTime = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const seconds = String(date.getSeconds()).padStart(2, "0")

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// Update the createTransaction function to include better error handling and logging
export const createTransaction = async (transactionData) => {
  try {
    // Format dates to the required format: yyyy-MM-dd HH:mm:ss
    const formattedData = {
      ...transactionData,
      startDate: formatDateWithTime(transactionData.startDate),
      endDate: formatDateWithTime(transactionData.endDate),
    }

    // Log the request data for debugging
    console.log("Creating transaction with formatted data:", formattedData)

    // Make sure we have a valid token
    const token = localStorage.getItem("token")
    if (!token) {
      console.error("No authentication token found")
      return {
        success: false,
        message: "Authentication token not found. Please log in again.",
      }
    }

    // Make the API request
    const response = await api.post("/transactions", formattedData)

    if (response.data.status === 201) {
      return {
        success: true,
        transaction: response.data.data,
        paymentUrl: response.data.data.paymentUrl,
        message: response.data.message || "Transaction created successfully",
      }
    } else {
      console.error("Transaction creation failed with response:", response.data)
      return {
        success: false,
        message: response.data.message || "Failed to create transaction",
      }
    }
  } catch (error) {
    console.error("Error creating transaction:", error)

    // Provide more detailed error information
    let errorMessage = "Failed to create transaction"

    if (error.response) {
      console.error("Error response data:", error.response.data)
      errorMessage =
        error.response.data.message || `Server returned ${error.response.status}: ${error.response.statusText}`
    }

    return {
      success: false,
      message: errorMessage,
      error: error.response?.data || error.message,
    }
  }
}

/**
 * Update transaction status (isUp and isDown flags)
 * @param {string} transactionId - Transaction ID
 * @param {Object} statusData - Status data to update (isUp, isDown)
 * @returns {Object} - Returns an object containing success status and updated transaction
 */
export const updateTransactionStatus = async (transactionId, statusData) => {
  try {
    // Make the API request to update transaction status
    const response = await api.patch(`/transactions/${transactionId}`, statusData)

    if (response.data.status === 200) {
      return {
        success: true,
        transaction: response.data.data,
        message: response.data.message || "Transaction status updated successfully",
      }
    } else {
      console.error("Transaction status update failed with response:", response.data)
      return {
        success: false,
        message: response.data.message || "Failed to update transaction status",
      }
    }
  } catch (error) {
    console.error(`Error updating transaction status for ID ${transactionId}:`, error)

    // Provide more detailed error information
    let errorMessage = "Failed to update transaction status"

    if (error.response) {
      console.error("Error response data:", error.response.data)
      errorMessage =
        error.response.data.message || `Server returned ${error.response.status}: ${error.response.statusText}`
    }

    return {
      success: false,
      message: errorMessage,
      error: error.response?.data || error.message,
    }
  }
}

/**
 * Get user's transactions (for My Booking page)
 * @returns {Object} - Returns an object containing success status and user's transactions
 */
export const getUserTransactions = async () => {
  try {
    // Get user ID from token
    const token = localStorage.getItem("token")
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found",
      }
    }

    const decoded = jwtDecode(token)
    const userId = decoded.userLoggedInId

    if (!userId) {
      return {
        success: false,
        message: "User ID not found in token",
      }
    }

    console.log("Fetching transactions for user ID:", userId)

    // Use the main transactions endpoint with hikerId filter
    const response = await api.get("/transactions", {
      params: { hikerId: userId },
    })

    if (response.data.status === 200) {
      // Filter the transactions to only include those where hikerId matches the user's ID
      const userTransactions = response.data.data.filter((transaction) => transaction.hikerId === userId)

      console.log("Filtered transactions:", userTransactions)

      return {
        success: true,
        transactions: userTransactions,
      }
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to fetch user transactions",
      }
    }
  } catch (error) {
    console.error("Error fetching user transactions:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch user transactions",
    }
  }
}

