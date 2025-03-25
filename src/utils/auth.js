const getToken = () => {
  return localStorage.getItem("token")
}

export { getToken }

// Add getUserInfo function to auth.js
export const getUserInfo = () => {
  const userInfoString = localStorage.getItem("userInfo")
  if (!userInfoString) return null

  try {
    return JSON.parse(userInfoString)
  } catch (error) {
    console.error("Error parsing user info:", error)
    return null
  }
}

// Add a function to get the correct hiker ID
export const getHikerId = () => {
  try {
    const userStr = localStorage.getItem("user")
    if (!userStr) return null

    const userData = JSON.parse(userStr)
    // Use loggedInId if available, otherwise fall back to id
    return userData.loggedInId || userData.id
  } catch (error) {
    console.error("Error getting hiker ID:", error)
    return null
  }
}

