import Layout from "../components/layout/Layout"
import Button from "../components/button/Button"
import { Link } from "react-router-dom"

const Home = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="bg-dark text-white py-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "500px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-4">Discover the Beauty of Mountain Hiking</h1>
              <p className="lead mb-5">
                Book your next adventure with HikeMate and explore the most beautiful mountains safely.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/mountains">
                  <Button variant="primary" size="lg">
                    Explore Mountains
                  </Button>
                </Link>
                <Button variant="outline-light" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <h2 className="text-center display-6 mb-5">Why Choose HikeMate?</h2>
          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="display-5 mb-4">🏔️</div>
                  <h3 className="h5 mb-3">Curated Trails</h3>
                  <p className="text-muted">Discover hand-picked hiking trails for all experience levels.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="display-5 mb-4">🔒</div>
                  <h3 className="h5 mb-3">Safe Journeys</h3>
                  <p className="text-muted">All our hiking packages include safety equipment and guides.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="display-5 mb-4">💰</div>
                  <h3 className="h5 mb-3">Best Prices</h3>
                  <p className="text-muted">Competitive pricing with no hidden fees or charges.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="display-5 mb-4">🌿</div>
                  <h3 className="h5 mb-3">Eco-Friendly</h3>
                  <p className="text-muted">We're committed to sustainable tourism practices.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white">
        <div className="container py-4 text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="display-6 mb-3">Ready for Your Next Adventure?</h2>
              <p className="lead mb-4">
                Join thousands of hikers who have discovered the beauty of mountains with HikeMate.
              </p>
              <Button variant="light" size="lg">
                Get Started Today
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Home

