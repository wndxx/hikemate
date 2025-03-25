import axios from "axios"
import { getToken } from "../utils/auth"
import { logApiError, createErrorResponse } from "../utils/apiUtils"

const API_URL = "http://10.10.103.80:8080/api/v1"

// Create a new transaction
export const createTransaction = async (transactionData) => {
  try {
    const token = getToken()
    const response = await axios.post(`${API_URL}/transactions`, transactionData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    console.log("Transaction creation response:", response.data)

    if (response.data.status === 201) {
      return {
        success: true,
        message: "Transaction created successfully!",
        transaction: response.data.data,
        paymentUrl: response.data.data.paymentUrl,
      }
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to create transaction",
      }
    }
  } catch (error) {
    console.error("Error creating transaction:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create transaction",
      error: error.response?.data || error.message,
    }
  }
}

// Get all transactions for current user
export const getUserTransactions = async () => {
  try {
    const token = getToken()

    // Get user ID from localStorage
    let hikerId = null
    try {
      const userStr = localStorage.getItem("user")
      if (userStr) {
        const userData = JSON.parse(userStr)

        // IMPORTANT: Use loggedInId instead of id
        // The user object contains both id and loggedInId, and loggedInId is the actual hiker ID
        hikerId = userData.loggedInId || userData.id

        console.log("Retrieved hiker ID from localStorage:", hikerId)
        console.log("Full user data:", userData)
      }
    } catch (e) {
      console.error("Error parsing user data from localStorage:", e)
    }

    if (!hikerId) {
      console.error("No hiker ID found for transaction fetch")
      return {
        success: false,
        message: "User ID not found",
      }
    }

    // Build query parameters - IMPORTANT: Do NOT include status parameter
    const params = {
      page: 1,
      size: 10,
      direction: "asc",
      sort: "id",
      hiker_id: hikerId,
    }

    console.log("Fetching transactions with params:", params)

    // Make the API request
    const response = await axios.get(`${API_URL}/transactions`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    console.log("User transactions response:", response.data)

    if (response.data.status === 200) {
      return {
        success: true,
        transactions: response.data.data || [],
        pagination: response.data.paging,
      }
    } else {
      return createErrorResponse(response.data.message || "Failed to fetch transactions")
    }
  } catch (error) {
    logApiError("fetching user transactions", error)

    // Special handling for 404 errors
    if (error.response && error.response.status === 404) {
      console.warn(
        "404 error when fetching transactions. This might be due to no transactions found or invalid hiker ID.",
      )
      return {
        success: true, // Return success with empty array instead of error
        transactions: [],
        message: "No transactions found",
      }
    }

    return createErrorResponse(error.response?.data?.message || "Failed to fetch transactions", error)
  }
}

// Get transaction by ID
export const getTransactionById = async (id) => {
  try {
    const token = getToken()
    const response = await axios.get(`${API_URL}/transactions/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.data.status === 200) {
      return {
        success: true,
        transaction: response.data.data,
      }
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to fetch transaction",
      }
    }
  } catch (error) {
    console.error("Error fetching transaction:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch transaction",
    }
  }
}

// Add the getAllTransactions function to the transactions.js file
// Get all transactions with pagination
export const getAllTransactions = async (page = 1, size = 10, direction = "asc", sort = "id") => {
  try {
    const token = getToken()
    const response = await axios.get(`${API_URL}/transactions`, {
      params: {
        page,
        size,
        direction,
        sort,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    console.log("Transactions API response:", response.data)

    if (response.data.status === 200) {
      return {
        success: true,
        transactions: response.data.data,
        pagination: response.data.paging,
      }
    } else {
      return createErrorResponse(response.data.message || "Failed to fetch transactions")
    }
  } catch (error) {
    logApiError("fetching transactions", error)
    return createErrorResponse(error.response?.data?.message || "Failed to fetch transactions", error)
  }
}

// Add the updateTransactionStatus function which is also used in TransactionsTable.jsx
export const updateTransactionStatus = async (id, statusData) => {
  try {
    const token = getToken()
    const response = await axios.patch(`${API_URL}/transactions/${id}/status`, statusData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (response.data.status === 200) {
      return {
        success: true,
        message: "Transaction status updated successfully!",
        transaction: response.data.data,
      }
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to update transaction status",
      }
    }
  } catch (error) {
    console.error("Error updating transaction status:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update transaction status",
    }
  }
}