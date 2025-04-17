"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/auth";
import Layout from "../components/layout/Layout";
import Form from "../components/form/Form";
import Button from "../components/button/Button";
import Loading from "../components/loading/Loading";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
    if (apiError) {
      setApiError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setApiError("");

    try {
      const result = await loginUser(formData.email, formData.password);
      
      if (result.success) {
        login(result.userData, result.token);
        // Redirect based on role
        navigate(result.userData.role.includes("SUPERADMIN") ? "/dashboard" : "/");
      } else {
        // Handle API response errors
        const errorMessage = result.response?.data?.message || 
                           result.message || 
                           "Invalid email or password";
        setApiError(errorMessage);
      }
    } catch (error) {
      console.error("Login error:", error);
      
      // Handle different types of errors
      let errorMessage = "An error occurred during login.";
      
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 401) {
          errorMessage = "Invalid email or password";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "Network error. Please check your connection.";
      }
      
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showNavbar={false} showFooter={false}>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Form Section */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f8f9fa",
          }}
        >
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6 col-xl-5">
                <div className="card shadow-sm border-0">
                  <div className="card-body p-4 p-md-5">
                    <h1 className="h3 text-center mb-2">HikeMate</h1>
                    <p className="text-muted text-center mb-4">Sign in to your account</p>

                    {apiError && (
                      <div className="alert alert-danger">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        {apiError}
                      </div>
                    )}

                    <Form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                          Email <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className={`form-control ${errors.email ? "is-invalid" : ""}`}
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                          Password <span className="text-danger">*</span>
                        </label>
                        <input
                          type="password"
                          className={`form-control ${errors.password ? "is-invalid" : ""}`}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter your password"
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="remember"
                          />
                          <label className="form-check-label" htmlFor="remember">
                            Remember me
                          </label>
                        </div>
                        <Link to="/forgot-password" className="text-decoration-none">
                          Forgot password?
                        </Link>
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        disabled={isLoading}
                        className="d-flex align-items-center justify-content-center"
                      >
                        {isLoading ? (
                          <>
                            <Loading size="sm" className="me-2" />
                            Signing in...
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </Button>

                      <div className="text-center mt-4">
                        <p className="mb-0">
                          Don't have an account?{" "}
                          <Link to="/register" className="text-decoration-none">
                            Sign up
                          </Link>
                        </p>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div
          style={{
            flex: 1,
            backgroundImage: "linear-gradient(rgba(0, 0, 139, 0.8), rgba(0, 0, 139, 0.8)), url(https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>
    </Layout>
  );
};

export default Login;