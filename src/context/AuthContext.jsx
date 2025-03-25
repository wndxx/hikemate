"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"

// Create the auth context
export const AuthContext = createContext()

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Load user data from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
      setIsAuthenticated(true)
    }

    setLoading(false)
  }, [])

  // Login function
  const login = (userData, authToken) => {
    // Ensure userData has the correct role format
    const processedUserData = {
      ...userData,
      // Make sure role is always an array
      role: Array.isArray(userData.role) ? userData.role : [userData.role],
    }

    // Store in state
    setUser(processedUserData)
    setToken(authToken)
    setIsAuthenticated(true)

    // Store in localStorage
    localStorage.setItem("user", JSON.stringify(processedUserData))
    localStorage.setItem("token", authToken)
  }

  // Logout function
  const logout = () => {
    // Clear state
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)

    // Clear localStorage
    localStorage.removeItem("user")
    localStorage.removeItem("token")

    // Redirect to login page
    navigate("/login")
  }

  // Context value
  const value = {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}