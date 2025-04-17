import { useState } from "react";
import { registerUser } from "../api/auth";
import Layout from "../components/layout/Layout";
import Form from "../components/form/Form";
import Button from "../components/button/Button";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../components/loading/Loading";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
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
    const phoneRegex = /^[0-9]{10,15}$/;

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (10-15 digits)";
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
      const result = await registerUser(
        formData.name,
        formData.phone,
        formData.email,
        formData.password
      );
  
      if (result.success) {
        navigate("/login", {
          state: { 
            registrationSuccess: true,
            message: "Registration successful! Please log in."
          }
        });
      } else {
        // Handle API response errors
        const errorMessage = result.response?.data?.message || 
                           result.message || 
                           "Registration failed. Please try again.";
        setApiError(errorMessage);
      }
    } catch (error) {
      console.error("Registration error:", error);
      
      // Handle different types of errors
      let errorMessage = "An error occurred during registration.";
      
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 409) {
          errorMessage = "Email already exists. Please use a different email.";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 404) {
          errorMessage = "Registration service unavailable. Please try again later.";
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
                    <h1 className="h3 text-center mb-2">Create Account</h1>
                    <p className="text-muted text-center mb-4">Sign up for HikeMate</p>

                    {apiError && (
                      <div className="alert alert-danger mb-4">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        {apiError}
                      </div>
                    )}

                    <Form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                          Name <span className="text-danger">*</span>
                        </label>
                        <input 
                          type="text" 
                          className={`form-control ${errors.name ? "is-invalid" : ""}`} 
                          id="name" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleChange} 
                          placeholder="Enter your name" 
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                      </div>

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
                        <label htmlFor="phone" className="form-label">
                          Phone Number <span className="text-danger">*</span>
                        </label>
                        <input 
                          type="tel" 
                          className={`form-control ${errors.phone ? "is-invalid" : ""}`} 
                          id="phone" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleChange} 
                          placeholder="Enter your phone number" 
                        />
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
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

                      <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">
                          Confirm Password <span className="text-danger">*</span>
                        </label>
                        <input
                          type="password"
                          className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm your password"
                        />
                        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
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
                            Signing Up...
                          </>
                        ) : (
                          "Sign Up"
                        )}
                      </Button>

                      <div className="text-center mt-4">
                        <p className="mb-0">
                          Already have an account?{" "}
                          <Link to="/login" className="text-decoration-none">
                            Sign in
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

        <div
          style={{
            flex: 1,
            backgroundColor: "navy",
            backgroundImage: "url(https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay"
          }}
        ></div>
      </div>
    </Layout>
  );
};

export default Register;