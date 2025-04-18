"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Layout from "../components/layout/Layout"
import Loading from "../components/loading/Loading"
import { getMountainById } from "../api/mountains"
import { createTransaction } from "../api/transactions"
import jwtDecode from "jwt-decode"

const TransactionPage = () => {
  const { id } = useParams() // Mountain ID from URL
  const navigate = useNavigate()
  const { user, token } = useAuth()

  // State for mountain and ranger data
  const [mountain, setMountain] = useState(null)
  const [ranger, setRanger] = useState(null)

  // State for form data
  const [formData, setFormData] = useState({
    hikerId: "",
    rangerId: "",
    mountainId: "",
    startDate: "",
    endDate: "",
    routeId: "",
  })

  // UI states
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [apiUnavailable, setApiUnavailable] = useState(false)

  // Fetch mountain data and ranger data, then set up form data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Get mountain details
        const mountainResult = await getMountainById(id)
        if (!mountainResult.success) {
          setError(mountainResult.message || "Failed to load mountain details")
          setIsLoading(false)
          return
        }

        setMountain(mountainResult.mountain)

        // Check if the mountain has ranger information
        if (mountainResult.mountain.rangerResponse) {
          setRanger(mountainResult.mountain.rangerResponse)
          console.log("Found ranger in mountain data:", mountainResult.mountain.rangerResponse)
        } else {
          console.log("No ranger information available in mountain data")
        }

        // Get user ID from token
        let userLoggedInId = ""
        if (token) {
          try {
            const decoded = jwtDecode(token)
            userLoggedInId = decoded.userLoggedInId
          } catch (error) {
            console.error("Error decoding token:", error)
            setError("Invalid authentication token. Please log in again.")
            setIsLoading(false)
            return
          }
        }

        // Set initial form data
        setFormData({
          ...formData,
          hikerId: userLoggedInId,
          mountainId: mountainResult.mountain.id,
          // Don't set rangerId here, we'll set it when ranger data is loaded
        })
      } catch (error) {
        console.error("Error fetching data:", error)

        // Check if this is a network error (API unavailable)
        if (error.message && error.message.includes("Network Error")) {
          setApiUnavailable(true)
          setError("The server is currently unavailable. Please try again later.")
        } else {
          setError("An error occurred while fetching data")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, token])

  // Update rangerId when ranger is loaded
  useEffect(() => {
    if (ranger && ranger.id) {
      setFormData((prev) => ({
        ...prev,
        rangerId: ranger.id,
      }))
      console.log("Setting ranger ID:", ranger.id)
    }
  }, [ranger])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Update the formatDateForAPI function to ensure proper format
  const formatDateForAPI = (dateString) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ""; // Invalid date
      
      // Format: yyyy-mm-dd hh:mm:ss
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
  
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  // Update the handleSubmit function to log the formatted data
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

      console.log("Submitting transaction with formatted data:", formattedData)

      const result = await createTransaction(formattedData)

      if (result.success) {
        setShowConfirmationModal(false)
        // If we have a payment URL from Midtrans, open it in a new tab
        if (result.paymentUrl) {
          // Store transaction ID in localStorage for reference
          if (result.transaction && result.transaction.transactionId) {
            localStorage.setItem("lastTransactionId", result.transaction.transactionId)
          }

          // Open payment URL in new tab
          window.open(result.paymentUrl, "_blank")

          // Navigate to my-booking page in the current tab
          navigate("/my-booking", { state: { fromPayment: true } })
        } else {
          // If no payment URL, navigate to booking page
          alert("Booking successful! Transaction ID: " + result.transaction.transactionId)
          navigate("/my-booking")
        }
      } else {
        // Provide detailed error information
        console.error("Transaction creation failed:", result)

        // Check for specific error messages
        if (result.message && result.message.includes("Only users with HIKER role")) {
          setError("Only users with HIKER role can create transactions. Please contact support.")
        } else if (result.message && result.message.includes("API endpoint")) {
          setError("The booking service is currently unavailable. Please try again later or contact support.")
        } else if (result.status === 403) {
          setError("You don't have permission to create this booking. Please contact support.")
        } else if (result.status === 400) {
          setError("Invalid booking data. Please check your information and try again.")
        } else {
          setError(result.message || "Failed to create booking. Please try again later.")
        }

        setShowConfirmationModal(false)
      }
    } catch (error) {
      console.error("Error creating transaction:", error)

      // Check if this is a network error (API unavailable)
      if (error.message && error.message.includes("Network Error")) {
        setApiUnavailable(true)
        setError("The server is currently unavailable. Please try again later.")
      } else if (error.response?.status === 404) {
        setError("The booking service endpoint could not be found. Please contact support with this information.")
      } else {
        setError("An error occurred while processing your booking. Please try again later.")
      }

      setShowConfirmationModal(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!mountain || !formData.startDate || !formData.endDate) return 0

    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1 // Include both start and end days

    return mountain.price
  }

  // Handle confirm booking
  const handleConfirmBooking = async () => {
    setShowConfirmationModal(false) // Close the modal
    handleSubmit(new Event("submit")) // Trigger the form submission
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

  if (apiUnavailable) {
    return (
      <Layout>
        <div className="container mt-5">
          <div className="alert alert-danger">
            <h4 className="alert-heading">Server Unavailable</h4>
            <p>The server is currently unavailable. Please try again later.</p>
          </div>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-2"></i>Back
          </button>
        </div>
      </Layout>
    )
  }

  if (error && !mountain) {
    return (
      <Layout>
        <div className="container mt-5">
          <div className="alert alert-danger">{error}</div>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-2"></i>Back
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container py-5">
        <h1 className="text-center mb-4">Book Your Hiking Trip</h1>

        {error && <div className="alert alert-danger mb-4">{error}</div>}

        <div className="row">
          <div className="col-lg-8">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Booking Details</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {/* Mountain Information */}
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3">Mountain Information</h6>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <div className="d-flex">
                          {mountain?.mountainCoverUrl && (
                            <img
                              src={mountain.mountainCoverUrl || "/placeholder.svg"}
                              alt={mountain.name}
                              className="img-thumbnail me-3"
                              style={{ width: "80px", height: "80px", objectFit: "cover" }}
                            />
                          )}
                          <div>
                            <h5 className="mb-1">{mountain?.name}</h5>
                            <p className="text-muted mb-0">{mountain?.location}</p>
                            <p className="mb-0">
                              <span
                                className={`badge bg-${
                                  mountain?.status === "SAFE" || mountain?.status === "OPEN"
                                    ? "success"
                                    : mountain?.status === "WARNING"
                                      ? "warning"
                                      : mountain?.status === "DANGEROUS"
                                        ? "danger"
                                        : "secondary"
                                }`}
                              >
                                {mountain?.status}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <p className="mb-1">
                          <strong>Price:</strong> Rp {mountain?.price?.toLocaleString()}/day
                        </p>
                        <p className="mb-1">
                          <strong>Quota Limit:</strong> {mountain?.quotaLimit} hikers
                        </p>
                        <p className="mb-0">
                          <strong>Ranger:</strong> {ranger ? ranger.name : "Loading ranger information..."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3">Select Dates</h6>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="startDate" className="form-label">
                          Start Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="startDate"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split("T")[0]}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="endDate" className="form-label">
                          End Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="endDate"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          min={formData.startDate || new Date().toISOString().split("T")[0]}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Route Selection */}
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3">Select Route</h6>
                    <div className="mb-3">
                      <label htmlFor="routeId" className="form-label">
                        Hiking Route <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        id="routeId"
                        name="routeId"
                        value={formData.routeId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select a route</option>
                        <option value="c95ddad6-e624-4581-b53b-61bd86923d2c">Jalur Utama</option>
                        <option value="28f80ad3-1d7c-4142-8cbe-f19e6a97542a">Jalur Alternatif</option>
                      </select>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                      <i className="bi bi-arrow-left me-2"></i>Back
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                      <i className="bi bi-calendar-check me-2"></i>Book Now
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Booking Summary</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-3">
                  <span>Mountain:</span>
                  <span className="fw-bold">{mountain?.name}</span>
                </div>

                {formData.startDate && (
                  <div className="d-flex justify-content-between mb-3">
                    <span>Start Date:</span>
                    <span>{formatDate(formData.startDate)}</span>
                  </div>
                )}

                {formData.endDate && (
                  <div className="d-flex justify-content-between mb-3">
                    <span>End Date:</span>
                    <span>{formatDate(formData.endDate)}</span>
                  </div>
                )}

                <div className="d-flex justify-content-between mb-3">
                  <span>Route:</span>
                  <span>
                    {formData.routeId === "c95ddad6-e624-4581-b53b-61bd86923d2c"
                      ? "Jalur Utama"
                      : formData.routeId === "28f80ad3-1d7c-4142-8cbe-f19e6a97542a"
                        ? "Jalur Alternatif"
                        : "Unknown Route"}
                  </span>
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-3">
                  <span className="fw-bold">Total Price:</span>
                  <span className="fw-bold fs-5">Rp {calculateTotalPrice().toLocaleString()}</span>
                </div>

                <div className="alert alert-info mb-0">
                  <small>
                    <i className="bi bi-info-circle me-2"></i>
                    The total price is calculated based on the number of days between your selected dates.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Booking</h5>
                <button type="button" className="btn-close" onClick={() => setShowConfirmationModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to book this hiking trip?</p>

                <div className="card bg-light mb-3">
                  <div className="card-body">
                    <p className="mb-1">
                      <strong>Mountain:</strong> {mountain?.name}
                    </p>
                    {formData.startDate && (
                      <p className="mb-1">
                        <strong>Start Date:</strong> {formatDate(formData.startDate)}
                      </p>
                    )}
                    {formData.endDate && (
                      <p className="mb-1">
                        <strong>End Date:</strong> {formatDate(formData.endDate)}
                      </p>
                    )}
                    <p className="mb-1">
                      <strong>Route:</strong>{" "}
                      {formData.routeId === "c95ddad6-e624-4581-b53b-61bd86923d2c"
                        ? "Jalur Utama"
                        : formData.routeId === "28f80ad3-1d7c-4142-8cbe-f19e6a97542a"
                          ? "Jalur Alternatif"
                          : "Unknown Route"}
                    </p>
                    <p className="mb-0">
                      <strong>Total Price:</strong> Rp {calculateTotalPrice().toLocaleString()}
                    </p>
                  </div>
                </div>

                <p className="mb-0">After confirming, you'll be redirected to the payment page.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmationModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loading /> : "Confirm & Pay"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default TransactionPage

