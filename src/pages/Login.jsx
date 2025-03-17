import { useState } from "react";
import Layout from "../components/layout/Layout";
import Form from "../components/form/Form";
import Button from "../components/button/Button";
import { Link } from "react-router-dom";
import { loginUser } from "../api/auth";

const Login = () => {
  // Update the formData state to include username
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

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

  // Update the validateForm function to validate username and check for Gmail
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await loginUser(formData.username, formData.password);

    if (result.success) {
      alert("Login successful!");
      localStorage.setItem("user", JSON.stringify(result.user));
      window.location.href = "/"; // Redirect setelah login
    } else {
      alert(result.message);
    }
  };

  // Update the form JSX to include the username field
  return (
    <Layout>
      <div className="bg-light py-5 min-vh-75 d-flex align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6 col-xl-5">
              <div className="card shadow-sm border-0">
                <div className="card-body p-4 p-md-5">
                  <h1 className="h3 text-center mb-2">Welcome Back</h1>
                  <p className="text-muted text-center mb-4">Sign in to your HikeMate account</p>

                  <Form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">
                        Username <span className="text-danger">*</span>
                      </label>
                      <input type="text" className={`form-control ${errors.username ? "is-invalid" : ""}`} id="username" name="username" value={formData.username} onChange={handleChange} placeholder="Enter your username" required />
                      {errors.username && <div className="invalid-feedback">{errors.username}</div>}
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

                    <Button type="submit" variant="primary" fullWidth>
                      Sign In
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
    </Layout>
  );
};

export default Login;
