"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Layout from "../components/layout/Layout"
import Loading from "../components/loading/Loading"
import mockApi from "../api/mockApi" // Changed to use mockApi directly
import Button from "../components/button/Button"

const MountainPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const [mountain, setMountain] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    const fetchMountainData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await mockApi.getMountainById(id)
        
        if (response.data) {
          setMountain({
            ...response.data,
            mountainCoverUrl: response.data.image,
            status: response.data.difficulty,
            isOpen: true,
            toilet: false,
            water: "Available at basecamp",
            quotaLimit: 100,
            baseCampImagesUrl: [response.data.image], // Single image array
            createdAt: response.data.created_at || new Date().toISOString()
          })
        } else {
          setError("Mountain data not found")
        }
      } catch (error) {
        console.error("Error fetching mountain:", error)
        setError(error.response?.data?.message || "Failed to load mountain details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMountainData()
  }, [id])

  const handleBookNow = () => {
    if (!isAuthenticated) {
      alert("You must login first to book a hiking trip.")
      navigate("/login")
    } else {
      navigate(`/transaction/${id}`)
    }
  }

  const statusColorMap = {
    Extreme: "danger",
    Hard: "warning",
    Moderate: "success",
    OPEN: "success",
    CLOSED: "dark"
  }

  const getStatusColor = (status) => statusColorMap[status] || "secondary"

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date"
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return "Invalid date"
    }
  }

  const handleImageError = (e) => {
    e.target.src = "/placeholder-mountain.jpg"
    e.target.onerror = null // Prevent infinite loop
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container mt-5 text-center py-5">
          <Loading />
          <p className="mt-3">Loading mountain details...</p>
        </div>
      </Layout>
    )
  }

  if (error || !mountain) {
    return (
      <Layout>
        <div className="container mt-5">
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error || "Mountain not found"}
          </div>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-2"></i>Back
          </Button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container my-5">
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="h4 mb-0">{mountain.name}</h1>
              <span className={`badge bg-${getStatusColor(mountain.status)}`}>
                {mountain.status}
              </span>
            </div>
          </div>
          
          <div className="card-body">
            <div className="row">
              {/* Image Section */}
              <div className="col-lg-6 mb-4 mb-lg-0">
                <div className="position-relative mb-3">
                  <img
                    src={mountain.mountainCoverUrl}
                    alt={mountain.name}
                    className="img-fluid rounded"
                    style={{ width: "100%", height: "400px", objectFit: "cover" }}
                    onError={handleImageError}
                  />
                  {!mountain.isOpen && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50">
                      <span className="badge bg-danger fs-5">CLOSED</span>
                    </div>
                  )}
                </div>

                {/* Image Gallery */}
                {mountain.baseCampImagesUrl?.length > 0 && (
                  <div className="mt-4">
                    <h5 className="mb-3">
                      <i className="bi bi-images me-2"></i>Gallery
                    </h5>
                    <div className="row g-2">
                      {mountain.baseCampImagesUrl.map((img, index) => (
                        <div className="col-4 col-md-3" key={index}>
                          <img
                            src={img}
                            alt={`${mountain.name} view ${index + 1}`}
                            className={`img-thumbnail ${activeImage === index ? "border-primary border-2" : ""}`}
                            style={{
                              height: "80px",
                              objectFit: "cover",
                              cursor: "pointer"
                            }}
                            onClick={() => setActiveImage(index)}
                            onError={handleImageError}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="col-lg-6">
                <div className="mb-4">
                  <h2 className="h3 mb-3">{mountain.name}</h2>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <span className="badge bg-primary">
                      <i className="bi bi-geo-alt me-1"></i> {mountain.location}
                    </span>
                    <span className="badge bg-success">
                      <i className="bi bi-arrow-up me-1"></i> {mountain.elevation}m
                    </span>
                    <span className={`badge bg-${getStatusColor(mountain.difficulty)}`}>
                      {mountain.difficulty}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h4 className="h5 mb-2">
                      <i className="bi bi-info-circle me-2"></i>Details
                    </h4>
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <th style={{ width: "40%" }}>Price:</th>
                          <td>{formatPrice(mountain.price)} per person</td>
                        </tr>
                        <tr>
                          <th>Status:</th>
                          <td>
                            <span className={`badge bg-${getStatusColor(mountain.status)}`}>
                              {mountain.status}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <th>Water Availability:</th>
                          <td>{mountain.water}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mb-4">
                    <h4 className="h5 mb-2">
                      <i className="bi bi-journal-text me-2"></i>Description
                    </h4>
                    <p className="text-justify">{mountain.description}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    onClick={handleBookNow} 
                    disabled={!mountain.isOpen}
                  >
                    <i className="bi bi-calendar-check me-2"></i>
                    {mountain.isOpen ? "Book Now" : "Currently Closed"}
                  </Button>
                  <Button variant="secondary" onClick={() => navigate(-1)}>
                    <i className="bi bi-arrow-left me-2"></i>Back
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default MountainPage