import { useState } from "react";
import { registerUser } from "../api/auth";
import Layout from "../components/layout/Layout";
import Form from "../components/form/Form";
import Button from "../components/button/Button";
import { Link } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Hapus error saat pengguna mengetik
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username) {
            newErrors.username = "Username is required";
        } else if (formData.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Hanya kirim username, email, dan password (tanpa confirmPassword)
            const result = await registerUser(formData.username, formData.password, formData.email);
            if (result.success) {
                alert("Registration successful! You can now log in.");
                window.location.href = "/login"; // Redirect ke login
            } else {
                alert(result.message);
            }
        }
    };
    

    return (
        <Layout>
            <div className="bg-light py-5 min-vh-75 d-flex align-items-center">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-6 col-xl-5">
                            <div className="card shadow-sm border-0">
                                <div className="card-body p-4 p-md-5">
                                    <h1 className="h3 text-center mb-2">Create Account</h1>
                                    <p className="text-muted text-center mb-4">Sign up for HikeMate</p>

                                    <Form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="username" className="form-label">
                                                Username <span className="text-danger">*</span>
                                            </label>
                                            <input type="text" className={`form-control ${errors.username ? "is-invalid" : ""}`} id="username" name="username" value={formData.username} onChange={handleChange} placeholder="Enter your username" required />
                                            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                                        </div>

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

                                        <div className="mb-3">
                                            <label htmlFor="confirmPassword" className="form-label">
                                                Confirm Password <span className="text-danger">*</span>
                                            </label>
                                            <input type="password" className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" required />
                                            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                                        </div>

                                        <Button type="submit" variant="primary" fullWidth>
                                            Sign Up
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
        </Layout>
    );
};

export default Register;
