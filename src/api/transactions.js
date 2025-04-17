import api from "./axiosInstance"

// Create a new transaction
export const createTransaction = async (transactionData) => {
  try {
    const response = await api.post("/transactions", transactionData)

    return {
      success: true,
      message: "Transaction created successfully!",
      transaction: response.data,
      paymentUrl: "https://example.com/payment", // Dummy payment URL
    }
  } catch (error) {
    console.error("Error creating transaction:", error)
    return {
      success: false,
      message: error.message || "Failed to create transaction",
      error: error,
    }
  }
}

// Get all transactions for current user
export const getUserTransactions = async () => {
  try {
    // Get user ID from localStorage
    let hikerId = null
    try {
      const userStr = localStorage.getItem("user")
      if (userStr) {
        const userData = JSON.parse(userStr)
        hikerId = userData.loggedInId || userData.id
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

    // Fetch transactions for this user
    const response = await api.get("/transactions", {
      params: { hiker_id: hikerId },
    })

    return {
      success: true,
      transactions: response.data || [],
      pagination: {
        page: 1,
        totalPages: 1,
        totalElements: response.data.length,
      },
    }
  } catch (error) {
    console.error("Error fetching user transactions:", error)

    // Special handling for 404 errors
    if (error.response && error.response.status === 404) {
      return {
        success: true,
        transactions: [],
        message: "No transactions found",
      }
    }

    return {
      success: false,
      message: error.message || "Failed to fetch transactions",
      error,
    }
  }
}

// Get transaction by ID
export const getTransactionById = async (id) => {
  try {
    const response = await api.get(`/transactions/${id}`)

    return {
      success: true,
      transaction: response.data,
    }
  } catch (error) {
    console.error("Error fetching transaction:", error)
    return {
      success: false,
      message: error.message || "Failed to fetch transaction",
    }
  }
}

// Get all transactions with pagination
export const getAllTransactions = async (page = 1, size = 10, direction = "asc", sort = "id") => {
  try {
    // Calculate pagination parameters for json-server
    const _start = (page - 1) * size
    const _limit = size
    const _sort = sort
    const _order = direction

    const response = await api.get("/transactions", {
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
      transactions: response.data,
      pagination: {
        page,
        totalPages: Math.ceil(totalCount / size),
        totalElements: totalCount,
        hasNext: page * size < totalCount,
        hasPrevious: page > 1,
      },
    }
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return {
      success: false,
      message: error.message || "Failed to fetch transactions",
      error,
    }
  }
}

// Update transaction status
export const updateTransactionStatus = async (id, statusData) => {
  try {
    // First get the current transaction
    const getResponse = await api.get(`/transactions/${id}`)
    const transaction = getResponse.data

    // Update with new status
    const updatedTransaction = {
      ...transaction,
      ...statusData,
    }

    // Save the updated transaction
    const response = await api.put(`/transactions/${id}`, updatedTransaction)

    return {
      success: true,
      message: "Transaction status updated successfully!",
      transaction: response.data,
    }
  } catch (error) {
    console.error("Error updating transaction status:", error)
    return {
      success: false,
      message: error.message || "Failed to update transaction status",
    }
  }
}
