"use client";

import { useState } from "react";
import Layout from "../components/layout/Layout";
import Form from "../components/form/Form";
import Button from "../components/button/Button";
import { Link, useNavigate } from "react-router-dom";
import { loginDirectly } from "../api/authService";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/loading/Loading";

const LoginAlternative = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
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

    try {
      // Use the direct fetch approach instead of axios
      const result = await loginDirectly(formData.email, formData.password);

      if (result.success) {
        // Store user data in context
        login(result.userData, result.token);

        // Redirect based on role
        if (result.userData.role.includes("SUPERADMIN")) {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      } else {
        alert(result.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showNavbar={false} showFooter={false}>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <div
          style={{
            flex: 5,
            backgroundImage: `url(https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        <div
          style={{
            flex: 5,
            backgroundColor: "#f8f9fa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6 col-xl-5">
                <div className="card shadow-sm border-0">
                  <div className="card-body p-4 p-md-5">
                    <h1 className="h3 text-center mb-2">HikeMate</h1>
                    <p className="text-muted text-center mb-4">Sign in to your HikeMate account</p>

                    <Form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                          Email <span className="text-danger">*</span>
                        </label>
                        <input type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`} id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                          Password <span className="text-danger">*</span>
                        </label>
                        <input type="password" className={`form-control ${errors.password ? "is-invalid" : ""}`} id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="form-check">
                          <input type="checkbox" className="form-check-input" id="remember" />
                          <label className="form-check-label" htmlFor="remember">
                            Remember me
                          </label>
                        </div>
                        <Link to="#" className="text-decoration-none">
                          Forgot password?
                        </Link>
                      </div>

                      <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
                        {isLoading ? <Loading /> : "Sign In (Alternative)"}
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
      </div>
    </Layout>
  );
};

export default LoginAlternative;
