import axios from "axios";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

const API_BASE_URL = "http://localhost:5000";
const SECRET_KEY = "your_secret_key"; 

// Registrasi User
export const registerUser = async (username, password, email, phone) => {
    try {
      // Cek apakah username sudah ada
      const checkUser = await axios.get(`${API_BASE_URL}/users`, { params: { username } });
  
      if (checkUser.data.length > 0) {
        return { success: false, message: "Username already exists" };
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const response = await axios.post(`${API_BASE_URL}/users`, {
        username,
        email,
        phone,
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

      const response = await axios.get(`${API_BASE_URL}/users`, {
        params: { username }
      });
  
      if (response.data.length === 0) {
        return { success: false, message: "User not found" };
      }
  
      const user = response.data[0]; 
  
 
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
