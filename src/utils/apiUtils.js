/**
 * Logs API errors in a consistent format
 * @param {string} action - The action being performed (e.g., "fetching mountains")
 * @param {Error} error - The error object
 */
export const logApiError = (action, error) => {
    console.error(`Error ${action}:`, error)
  
    if (error.response) {
      console.error("Response status:", error.response.status)
      console.error("Response data:", error.response.data)
    } else if (error.request) {
      console.error("No response received:", error.request)
    } else {
      console.error("Error message:", error.message)
    }
  
    if (error.config) {
      console.error("Request URL:", error.config.url)
      console.error("Request method:", error.config.method)
      console.error("Request params:", error.config.params)
    }
  }
  
  /**
   * Creates a standard error response object
   * @param {string} message - Error message
   * @param {any} error - Original error object
   * @returns {Object} Standardized error response
   */
  export const createErrorResponse = (message, error) => {
    return {
      success: false,
      message: message || "An error occurred",
      error: error,
    }
  }  