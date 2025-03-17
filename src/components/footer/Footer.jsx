import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <h3 className="h5 text-primary mb-3">HikeMate</h3>
            <p className="text-white">Your companion for safe and enjoyable hiking adventures.</p>
          </div>

          <div className="col-md-4 mb-4 mb-md-0">
            <h3 className="h5 text-primary mb-3">Quick Links</h3>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link className="text-white text-decoration-none" to="/">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link className="text-white text-decoration-none" to="/mountains">
                  Mountains
                </Link>
              </li>
              <li className="mb-2">
                <Link className="text-white text-decoration-none" to="/dashboard">
                  Dashboard
                </Link>
              </li>
              <li className="mb-2">
                <Link className="text-white text-decoration-none" to="/login">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-4">
            <h3 className="h5 text-primary mb-3">Contact Us</h3>
            <p className="text-white mb-1">Email: info@hikemate.com</p>
            <p className="text-white">Phone: +1 (123) 456-7890</p>
          </div>
        </div>

        <div className="border-top border-secondary mt-4 pt-4 text-center text-white">
          <p className="mb-0">&copy; {new Date().getFullYear()} HikeMate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

