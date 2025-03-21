import { createSlice } from "@reduxjs/toolkit"

// Get user data from localStorage
const user = JSON.parse(localStorage.getItem("user"))
const token = localStorage.getItem("token")

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: !!token,
    user: user || null,
    role: user?.role || null,
    token: token || null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true
      state.user = action.payload.user
      state.role = action.payload.user.role
      state.token = action.payload.token
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.role = null
      state.token = null

      // Clear localStorage
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    },
  },
})

export const { loginSuccess, logoutSuccess } = authSlice.actions
export default authSlice.reducer

