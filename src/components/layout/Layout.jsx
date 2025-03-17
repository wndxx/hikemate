
import Navbar from "../navbar/Navbar"
import Footer from "../footer/Footer"

const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout

