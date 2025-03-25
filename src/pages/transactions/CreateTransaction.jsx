"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { createTransaction } from "../../api/transactions"
import { getMountainById } from "../../api/mountains"
import { getAllRoutes } from "../../api/routes"
import { Link } from "react-router-dom"
import Loading from "../../components/loading/Loading"
import { getUserInfo } from "../../utils/auth"

const CreateTransaction = () => {
  const { mountainId } = useParams()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [mountain, setMountain] = useState(null)
  const [routes, setRoutes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [paymentUrl, setPaymentUrl] = useState("")
  const userInfo = getUserInfo()

  // Form data state
  const [formData, setFormData] = useState({
    hikerId: userInfo?.id || "",
    mountainId: mountainId || "",
    startDate: "",
    endDate: "",
    routeId: "",
  })

  // Fetch mountain data and routes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        if (mountainId) {
          const mountainResult = await getMountainById(mountainId)
          if (mountainResult.success) {
            setMountain(mountainResult.mountain)
            setFormData((prev) => ({
              ...prev,
              mountainId: mountainResult.mountain.id,
            }))
          } else {
            setError("Failed to fetch mountain data")
          }
        }

        const routesResult = await getAllRoutes()
        if (routesResult.success) {
          setRoutes(routesResult.routes || [])
        } else {
          console.error("Failed to fetch routes:", routesResult.message)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("An error occurred while fetching data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [mountainId])

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Format date for API
  const formatDateForAPI = (dateString) => {
    const date = new Date(dateString)
    console.log(date);
    
    return date.toISOString().replace("Z", "+07:00")
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Format dates for API
      const formattedData = {
        ...formData,
        startDate: formatDateForAPI(formData.startDate),
        endDate: formatDateForAPI(formData.endDate),
      }

      console.log(formattedData);
      

      const result = await createTransaction(formattedData)

      if (result.success) {
        setShowSuccess(true)
        setPaymentUrl(result.paymentUrl)
      } else {
        setError(result.message || "Failed to create transaction")
      }
    } catch (error) {
      console.error("Error creating transaction:", error)
      setError("An error occurred while creating the transaction")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <Loading />
          <p className="mt-3">Loading mountain data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Book Your Hiking Trip</h2>
            <Link to="/mountains" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left me-2"></i>Back to Mountains
            </Link>
          </div>

          {showSuccess ? (
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <div className="mb-4">
                  <i className="bi bi-check-circle-fill text-success display-1"></i>
                </div>
                <h3 className="mb-2">Booking Created Successfully!</h3>
                <p className="text-muted mb-4">
                  Your booking has been created. Please proceed to payment to confirm your reservation.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <a href={paymentUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    <i className="bi bi-credit-card me-2"></i>Proceed to Payment
                  </a>
                  <Link to="/my-bookings" className="btn btn-outline-primary">
                    View My Bookings
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="card shadow-sm">
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger mb-4">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-lg-6">
                      {/* Mountain Information */}
                      {mountain && (
                        <div className="card mb-4">
                          <img
                            src={mountain.mountainCoverUrl || "/placeholder.svg"}
                            className="card-img-top"
                            alt={mountain.name}
                            style={{ height: "200px", objectFit: "cover" }}
                          />
                          <div className="card-body">
                            <h5 className="card-title">{mountain.name}</h5>
                            <p className="card-text text-muted mb-2">{mountain.location}</p>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <span
                                className={`badge ${
                                  mountain.status === "SAFE"
                                    ? "bg-success"
                                    : mountain.status === "WARNING"
                                      ? "bg-warning"
                                      : mountain.status === "DANGEROUS"
                                        ? "bg-danger"
                                        : mountain.status === "CLOSED"
                                          ? "bg-secondary"
                                          : "bg-info"
                                }`}
                              >
                                {mountain.status}
                              </span>
                              <h5 className="mb-0 text-primary">IDR {mountain.price.toLocaleString()}</h5>
                            </div>
                            <div className="mb-3">
                              <small className="text-muted">
                                <i className="bi bi-info-circle me-1"></i>
                                Quota: {mountain.quotaLimit} hikers per day
                              </small>
                            </div>
                            <div className="mb-3">
                              <h6>Facilities:</h6>
                              <div className="d-flex flex-wrap gap-2">
                                <span className="badge bg-light text-dark">
                                  <i
                                    className={`bi bi-${mountain.toilet ? "check-circle-fill text-success" : "x-circle-fill text-danger"} me-1`}
                                  ></i>
                                  Toilet
                                </span>
                                <span className="badge bg-light text-dark">
                                  <i className="bi bi-droplet-fill text-primary me-1"></i>
                                  Water: {mountain.water}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="col-lg-6">
                      {/* Booking Form */}
                      <div className="card mb-4">
                        <div className="card-header bg-light">
                          <h5 className="mb-0">Booking Details</h5>
                        </div>
                        <div className="card-body">
                          <div className="mb-3">
                            <label htmlFor="startDate" className="form-label">
                              Start Date <span className="text-danger">*</span>
                            </label>
                            <input
                              type="datetime-local"
                              className="form-control"
                              id="startDate"
                              name="startDate"
                              value={formData.startDate}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="endDate" className="form-label">
                              End Date <span className="text-danger">*</span>
                            </label>
                            <input
                              type="datetime-local"
                              className="form-control"
                              id="endDate"
                              name="endDate"
                              value={formData.endDate}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="routeId" className="form-label">
                              Select Route <span className="text-danger">*</span>
                            </label>
                            {routes.length > 0 ? (
                              <select
                                className="form-select"
                                id="routeId"
                                name="routeId"
                                value={formData.routeId}
                                onChange={handleInputChange}
                                required
                              >
                                <option value="">Select a route</option>
                                {routes.map((route) => (
                                  <option key={route.id} value={route.id}>
                                    {route.routeName} - {route.difficulty} ({route.estimatedTime})
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <div className="alert alert-warning">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                No routes available for this mountain.
                              </div>
                            )}
                          </div>

                          <div className="alert alert-info">
                            <i className="bi bi-info-circle me-2"></i>
                            By proceeding with this booking, you agree to follow all hiking regulations and safety
                            guidelines.
                          </div>
                        </div>
                      </div>

                      {/* Hiker Information */}
                      <div className="card mb-4">
                        <div className="card-header bg-light">
                          <h5 className="mb-0">Hiker Information</h5>
                        </div>
                        <div className="card-body">
                          <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input type="text" className="form-control" value={userInfo?.name || ""} disabled />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" value={userInfo?.email || ""} disabled />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Phone Number</label>
                            <input type="text" className="form-control" value={userInfo?.phoneNumber || ""} disabled />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <Link to="/mountains" className="btn btn-secondary">
                      Cancel
                    </Link>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Processing...
                        </>
                      ) : (
                        "Book Now"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateTransaction