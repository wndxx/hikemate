import { useState } from "react";
import Layout from "../components/layout/Layout";
import Form from "../components/form/Form";
import Button from "../components/button/Button";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/slice/authSlice";
import Loading from "../components/loading/Loading";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch();
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

    if (!validateForm()) return;

    setIsLoading(true)

    try{
    const result = await loginUser(formData.username, formData.password);

    if (result.success) {
      alert("Login successful!");
      dispatch(
        loginSuccess({
          user: result.user,
          role: result.user.role,
        })
      );
      localStorage.setItem("user", JSON.stringify(result.user));
      navigate("/");
    } else {
      alert(result.message);
    }
  }catch(error){
    alert("An error occured. Please try again. ")
  }finally{
    setIsLoading(false)
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

        
        <div style={{ flex: 5, backgroundColor: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6 col-xl-5">
                <div className="card shadow-sm border-0">
                  <div className="card-body p-4 p-md-5">
                    <h1 className="h3 text-center mb-2">HikeMate</h1>
                    <p className="text-muted text-center mb-4">Sign in to your HikeMate account</p>

                    <Form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                          Username <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.username ? "is-invalid" : ""}`}
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          placeholder="Enter your username"
                          required
                        />
                        {errors.username && <div className="invalid-feedback">{errors.username}</div>}
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
                          required
                        />
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

                      <Button type="submit" variant="primary" fullWidth disabled={isLoading}> {isLoading ? <Loading/> : "Sign In"}
                        
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

export default Login;