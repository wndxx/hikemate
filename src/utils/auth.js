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

