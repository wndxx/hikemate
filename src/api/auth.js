import axios from "axios";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

const API_BASE_URL = "http://localhost:5000";
const SECRET_KEY = "your_secret_key"; // Gantilah dengan kunci rahasia yang aman

// Registrasi User
export const registerUser = async (username, password, email) => {
    try {
      // Cek apakah username sudah ada
      const checkUser = await axios.get(`${API_BASE_URL}/users`, { params: { username } });
  
      if (checkUser.data.length > 0) {
        return { success: false, message: "Username already exists" };
      }
  
      // Hash password sebelum menyimpan
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Simpan user baru
      const response = await axios.post(`${API_BASE_URL}/users`, {
        username,
        email,
        password: hashedPassword
      });
  
      return { success: true, user: response.data };
    } catch (error) {
      console.error("Error registering user", error);
      return { success: false, message: "Server error" };
    }
  };
  

// Login User
export const loginUser = async (username, password) => {
    try {
      // Cek apakah user ada di database
      const response = await axios.get(`${API_BASE_URL}/users`, {
        params: { username }
      });
  
      if (response.data.length === 0) {
        return { success: false, message: "User not found" };
      }
  
      const user = response.data[0]; // Ambil user pertama dengan username yang sesuai
  
      // Bandingkan password dengan bcrypt
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return { success: false, message: "Invalid credentials" };
      }
  
      return { success: true, user };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Server error" };
    }
  };
