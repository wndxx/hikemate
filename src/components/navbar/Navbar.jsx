import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutSuccess } from "../../store/slice/authSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { isAuthenticated, user, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Ambil path saat ini

  const handleLogout = () => {
    dispatch(logoutSuccess());
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <h1 className="h4 mb-0">HikeMate</h1>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === "/mountains" ? "active" : ""}`}
                to="/mountains"
              >
                Mountains
              </Link>
            </li>

            {isAuthenticated && role === "admin" && (
              <li className="nav-item">
                <Link
                  className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}
                  to="/dashboard"
                >
                  Dashboard
                </Link>
              </li>
            )}

            <li className="nav-item">
              {isAuthenticated ? (
                <div className="dropdown">
                  {/* Tombol dropdown dengan ikon profil */}
                  <button
                    className="btn btn-link nav-link dropdown-toggle d-flex align-items-center"
                    type="button"
                    id="profileDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-person fs-5 text-white"></i> {/* Ikon profil */}
                  </button>

                  {/* Menu dropdown */}
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                    <li>
                      <Link
                        className={`dropdown-item ${location.pathname === "/profile" ? "active" : ""}`}
                        to="/profile"
                      >
                        <i className="bi bi-pencil me-2"></i> Edit Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`dropdown-item ${location.pathname === "/my-booking" ? "active" : ""}`}
                        to="/my-booking"
                      >
                        <i className="bi bi-journal-check me-2"></i> My Booking
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link
  className={`nav-link btn text-white ms-lg-2 px-3 ${location.pathname === "/login" ? "active" : ""}`}
  to="/login"
  style={{
    backgroundColor: "#6c757d", // Warna abu-abu
    borderColor: "#6c757d", // Warna border abu-abu
  }}
  onMouseOver={(e) => {
    e.target.style.backgroundColor = "#0d6efd"; // Warna biru saat di-hover
    e.target.style.borderColor = "#0d6efd"; // Warna border biru saat di-hover
  }}
  onMouseOut={(e) => {
    e.target.style.backgroundColor = "#6c757d"; // Kembali ke warna abu-abu
    e.target.style.borderColor = "#6c757d"; // Kembali ke warna border abu-abu
  }}
>
  Login
</Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;