"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Layout from "../components/layout/Layout"
import Loading from "../components/loading/Loading"
import { getMountainById } from "../api/mountains"

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
      try {
        const result = await getMountainById(id)
        if (result.success) {
          setMountain(result.mountain)
        } else {
          setError(result.message || "Failed to load mountain details")
        }
      } catch (error) {
        console.error("Error fetching mountain:", error)
        setError("An error occurred while fetching mountain details")
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
      navigate(`/transaction/${mountain.id}`)
    }
  }

  // Format price to IDR
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container mt-5 text-center">
          <Loading />
        </div>
      </Layout>
    )
  }

  if (error || !mountain) {
    return (
      <Layout>
        <div className="container mt-5">
          <div className="alert alert-danger">{error || "Mountain not found"}</div>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-2"></i>Back
          </button>
        </div>
      </Layout>
    )
  }

  // Map status to Bootstrap color classes
  const statusColorMap = {
    SAFE: "success",
    OPEN: "success",
    WARNING: "warning",
    DANGEROUS: "danger",
    CLOSED: "dark",
  }

  const statusColor = statusColorMap[mountain.status] || "secondary"

  return (
    <Layout>
      <div className="container mt-5 mb-5">
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <h1 className="h4 mb-0">{mountain.name}</h1>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-4">
                {/* Main image */}
                <div className="position-relative mb-3">
                  <img
                    src={mountain.mountainCoverUrl || "https://via.placeholder.com/600x400?text=No+Image"}
                    alt={mountain.name}
                    className="img-fluid rounded"
                    style={{ width: "100%", height: "400px", objectFit: "cover" }}
                  />
                  <span className={`position-absolute top-0 end-0 m-2 badge bg-${statusColor} fs-6`}>
                    {mountain.status}
                  </span>

                  {!mountain.isOpen && (
                    <div
                      className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    >
                      <span className="badge bg-danger fs-3 p-3">CLOSED</span>
                    </div>
                  )}
                </div>

                {/* Basecamp images gallery */}
                {mountain.baseCampImagesUrl && mountain.baseCampImagesUrl.length > 0 && (
                  <div>
                    <h5 className="mb-3">Basecamp Images</h5>
                    <div className="row g-2">
                      {mountain.baseCampImagesUrl.map((img, index) => (
                        <div className="col-4" key={index}>
                          <img
                            src={img || "/placeholder.svg"}
                            alt={`Basecamp ${index + 1}`}
                            className="img-thumbnail cursor-pointer"
                            style={{
                              height: "80px",
                              objectFit: "cover",
                              cursor: "pointer",
                              border: activeImage === index ? "3px solid #0d6efd" : "",
                            }}
                            onClick={() => setActiveImage(index)}
                          />
                        </div>
                      ))}
                    </div>

                    {activeImage !== null && (
                      <div className="mt-3">
                        <img
                          src={mountain.baseCampImagesUrl[activeImage] || "/placeholder.svg"}
                          alt={`Basecamp view ${activeImage + 1}`}
                          className="img-fluid rounded"
                          style={{ width: "100%", height: "300px", objectFit: "cover" }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="col-md-6">
                <div className="mb-4">
                  <h2 className="h3 mb-3">{mountain.name}</h2>
                  <p className="mb-2">
                    <strong>Location:</strong> {mountain.location}
                  </p>
                  <p className="mb-2">
                    <strong>Status:</strong> <span className={`text-${statusColor}`}>{mountain.status}</span>
                  </p>
                  <p className="mb-2">
                    <strong>Price:</strong> {formatPrice(mountain.price)} per person
                  </p>
                  <p className="mb-2">
                    <strong>Quota Limit:</strong> {mountain.quotaLimit} hikers
                  </p>
                  <p className="mb-2">
                    <strong>Toilet Available:</strong> {mountain.toilet ? "Yes" : "No"}
                  </p>
                  <p className="mb-2">
                    <strong>Water Availability:</strong> {mountain.water}
                  </p>
                  <p className="mb-2">
                    <strong>Created At:</strong> {new Date(mountain.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="h5 mb-2">Description</h4>
                  <p style={{ textAlign: "justify" }}>{mountain.description}</p>
                </div>

                {mountain.rangerResponse && (
                  <div className="mb-4">
                    <h4 className="h5 mb-2">Ranger Information</h4>
                    <div className="card bg-light">
                      <div className="card-body">
                        <p className="mb-1">
                          <strong>Name:</strong> {mountain.rangerResponse.name}
                        </p>
                        <p className="mb-1">
                          <strong>Contact:</strong> {mountain.rangerResponse.phoneNumber}
                        </p>
                        <p className="mb-0">
                          <strong>Assigned Since:</strong>{" "}
                          {new Date(mountain.rangerResponse.assignedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="d-grid gap-2">
                  <button type="button" className="btn btn-primary" onClick={handleBookNow} disabled={!mountain.isOpen}>
                    <i className="bi bi-calendar-check me-2"></i>
                    {mountain.isOpen ? "Book Now" : "Currently Closed"}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                    <i className="bi bi-arrow-left me-2"></i>Back
                  </button>
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

