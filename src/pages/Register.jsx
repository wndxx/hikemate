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
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = "Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setIsLoading(true);
  
    try {
      const result = await registerUser(formData.name, formData.phone, formData.email, formData.password);
  
      if (result.success) {
        alert("Registration successful! You can now log in.");
        navigate("/login");
      } else {
        const errorMessage = result.message || "Registration failed. Please try again.";
        console.error("Registration failed:", result);
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Registration error:", error);
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

                    <Form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                          Name <span className="text-danger">*</span>
                        </label>
                        <input type="text" className={`form-control ${errors.name ? "is-invalid" : ""}`} id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" required />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                          Email <span className="text-danger">*</span>
                        </label>
                        <input type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`} id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="phone" className="form-label">
                          Phone Number <span className="text-danger">*</span>
                        </label>
                        <input type="tel" className={`form-control ${errors.phone ? "is-invalid" : ""}`} id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" required />
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                          Password <span className="text-danger">*</span>
                        </label>
                        <input type="password" className={`form-control ${errors.password ? "is-invalid" : ""}`} id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required />
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
                          required
                        />
                        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                      </div>

                      <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
                        {isLoading ? <Loading /> : "Sign Up"}
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
            flex: 5,
            backgroundColor: "navy",
            backgroundSize: "auto",
            backgroundPosition: "center",
          }}
        ></div>
      </div>
    </Layout>
  );
};

export default Register;
