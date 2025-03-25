"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Layout from "../components/layout/Layout"
import Loading from "../components/loading/Loading"
import { getUserTransactions } from "../api/transactions"
import { useAuth } from "../context/AuthContext"

const MyBookingPage = () => {
  const { user, isAuthenticated } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [allTransactions, setAllTransactions] = useState([]) // Store all transactions
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("active") // active, completed, cancelled
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const location = useLocation()
  const [showPaymentSuccessAlert, setShowPaymentSuccessAlert] = useState(false)

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to login")
      navigate("/login", { state: { from: location.pathname } })
    }
  }, [isAuthenticated, navigate, location])

  useEffect(() => {
    // Check if we're coming from a payment redirect
    if (location.state?.fromPayment) {
      setShowPaymentSuccessAlert(true)
      // Clear the state after 5 seconds
      const timer = setTimeout(() => {
        setShowPaymentSuccessAlert(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [location])

  // Fetch transactions only once
  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions()
    }
  }, [isAuthenticated])

  // Filter transactions when tab changes
  useEffect(() => {
    if (allTransactions.length > 0) {
      filterTransactionsByTab()
    }
  }, [activeTab, allTransactions])

  const fetchTransactions = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Log user information for debugging
      console.log("Current user from context:", user)
      console.log("User from localStorage:", localStorage.getItem("user"))

      // Fetch all transactions for the user without status filtering
      const result = await getUserTransactions()
      console.log("Transaction fetch result:", result)

      if (result.success) {
        // Store all transactions
        setAllTransactions(result.transactions || [])
        // Initial filtering based on active tab
        filterTransactionsByTab(result.transactions || [])
      } else {
        console.warn("Warning fetching transactions:", result.message)
        setAllTransactions([])
        setTransactions([])
        if (result.message && result.message !== "No transactions found" && result.message !== "User ID not found") {
          setError(`Unable to load your bookings: ${result.message}`)
        }
      }
    } catch (error) {
      console.error("Error in fetchTransactions:", error)
      setAllTransactions([])
      setTransactions([])
      setError("An unexpected error occurred while loading your bookings. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  // Filter transactions based on active tab
  const filterTransactionsByTab = (transactionsToFilter = allTransactions) => {
    let filteredData = []

    if (activeTab === "active") {
      // Active bookings: ORDERED or PENDING
      filteredData = transactionsToFilter.filter(
        (transaction) => transaction.paymentStatus === "ORDERED" || transaction.paymentStatus === "PENDING",
      )
    } else if (activeTab === "completed") {
      // Completed bookings: SETTLEMENT or PAID
      filteredData = transactionsToFilter.filter(
        (transaction) => transaction.paymentStatus === "SETTLEMENT" || transaction.paymentStatus === "PAID",
      )
    } else if (activeTab === "cancelled") {
      // Cancelled/Failed bookings: CANCEL, FAILURE, EXPIRED, DENY
      filteredData = transactionsToFilter.filter((transaction) =>
        ["CANCEL", "FAILURE", "EXPIRED", "DENY"].includes(transaction.paymentStatus),
      )
    }

    setTransactions(filteredData)
  }

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Format price to IDR
  const formatPrice = (price) => {
    const minimumFractionDigits = 0
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: minimumFractionDigits,
    }).format(price)
  }

  // Handle payment continuation - open in new tab
  const handleContinuePayment = (paymentUrl) => {
    window.open(paymentUrl, "_blank")
  }

  // Handle view details
  const handleViewDetails = (trx) => {
    setSelectedTransaction(trx)
    setShowModal(true)
  }

  // Handle close modal
  const handleCloseModal = () => {
    setShowModal(false)
  }

  // If not authenticated, show loading until redirect happens
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container py-5 text-center">
          <Loading />
          <p className="mt-3">Checking authentication status...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container py-5">
        <h1 className="text-center mb-4">My Bookings</h1>
        {showPaymentSuccessAlert && (
          <div className="alert alert-info alert-dismissible fade show mb-4" role="alert">
            <i className="bi bi-info-circle me-2"></i>
            Your payment is being processed. Once completed, your booking will be updated automatically.
            <button type="button" className="btn-close" onClick={() => setShowPaymentSuccessAlert(false)}></button>
          </div>
        )}

        {error && <div className="alert alert-danger mb-4">{error}</div>}

        {/* Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "active" ? "active" : ""}`}
              onClick={() => setActiveTab("active")}
            >
              Active Bookings
            </button>
          </li>
        </ul>

        {isLoading ? (
          <div className="text-center py-5">
            <Loading />
          </div>
        ) : transactions.length > 0 ? (
          <div className="row">
            {transactions.map((transaction) => (
              <div className="col-md-6 mb-4" key={transaction.transactionId}>
                <div className="card shadow-sm h-100">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Booking #{transaction.transactionId.substring(0, 8)}</h5>
                    <span
                      className={`badge ${
                        transaction.paymentStatus === "SETTLEMENT" || transaction.paymentStatus === "PAID"
                          ? "bg-success"
                          : transaction.paymentStatus === "ORDERED" || transaction.paymentStatus === "PENDING"
                            ? "bg-warning"
                            : "bg-danger"
                      }`}
                    >
                      {transaction.paymentStatus}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="d-flex mb-3">
                      {transaction.mountain?.mountainCoverUrl && (
                        <img
                          src={transaction.mountain.mountainCoverUrl || "/placeholder.svg"}
                          alt={transaction.mountain.name}
                          className="img-thumbnail me-3"
                          style={{ width: "80px", height: "80px", objectFit: "cover" }}
                        />
                      )}
                      <div>
                        <h5 className="mb-1">{transaction.mountain?.name}</h5>
                        <p className="text-muted mb-0">{transaction.mountain?.location}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="mb-1">
                        <strong>Route:</strong> {transaction.route}
                      </p>
                      <p className="mb-1">
                        <strong>Start Date:</strong> {formatDate(transaction.startDate)}
                      </p>
                      <p className="mb-1">
                        <strong>End Date:</strong> {formatDate(transaction.endDate)}
                      </p>
                      <p className="mb-1">
                        <strong>Price:</strong> {formatPrice(transaction.price)}
                      </p>
                      <p className="mb-0">
                        <strong>Transaction Date:</strong> {formatDate(transaction.transactionDate)}
                      </p>
                    </div>

                    <div className="d-flex justify-content-between mt-3">
                      {(transaction.paymentStatus === "ORDERED" || transaction.paymentStatus === "PENDING") &&
                        transaction.paymentUrl && (
                          <button
                            className="btn btn-primary"
                            onClick={() => handleContinuePayment(transaction.paymentUrl)}
                          >
                            <i className="bi bi-credit-card me-2"></i>Continue Payment
                          </button>
                        )}
                      <button className="btn btn-info" onClick={() => handleViewDetails(transaction)}>
                        <i className="bi bi-eye me-2"></i>View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card">
            <div className="card-body text-center py-5">
              <i className="bi bi-calendar-x display-4 text-muted mb-3"></i>
              <h5>No {activeTab} bookings found</h5>
              <p className="mb-4">You don't have any {activeTab} bookings at the moment.</p>
              <Link to="/mountains" className="btn btn-primary">
                <i className="bi bi-search me-2"></i>Explore Mountains
              </Link>
            </div>
          </div>
        )}

        {/* Modal for Transaction Details */}
        {showModal && (
          <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Booking Details</h5>
                  <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                </div>
                <div className="modal-body">
                  {selectedTransaction && (
                    <div className="row">
                      <div className="col-md-6">
                        <h6>Transaction Information</h6>
                        <p>
                          <strong>ID:</strong> {selectedTransaction.transactionId}
                        </p>
                        <p>
                          <strong>Status:</strong>
                          <span
                            className={`badge ${
                              selectedTransaction.paymentStatus === "SETTLEMENT" ||
                              selectedTransaction.paymentStatus === "PAID"
                                ? "bg-success"
                                : selectedTransaction.paymentStatus === "ORDERED" ||
                                    selectedTransaction.paymentStatus === "PENDING"
                                  ? "bg-warning"
                                  : "bg-danger"
                            } ms-2`}
                          >
                            {selectedTransaction.paymentStatus}
                          </span>
                        </p>
                        <p>
                          <strong>Date:</strong> {formatDate(selectedTransaction.transactionDate)}
                        </p>
                        <p>
                          <strong>Amount:</strong> {formatPrice(selectedTransaction.price)}
                        </p>

                        <h6 className="mt-4">Climbing Information</h6>
                        <p>
                          <strong>Route:</strong> {selectedTransaction.route}
                        </p>
                        <p>
                          <strong>Start Date:</strong> {formatDate(selectedTransaction.startDate)}
                        </p>
                        <p>
                          <strong>End Date:</strong> {formatDate(selectedTransaction.endDate)}
                        </p>
                        <p>
                          <strong>Up Status:</strong>
                          <span className={`badge ${selectedTransaction.isUp ? "bg-success" : "bg-secondary"} ms-2`}>
                            {selectedTransaction.isUp ? "Up" : "Not Up"}
                          </span>
                        </p>
                        <p>
                          <strong>Down Status:</strong>
                          <span className={`badge ${selectedTransaction.isDown ? "bg-info" : "bg-secondary"} ms-2`}>
                            {selectedTransaction.isDown ? "Down" : "Not Down"}
                          </span>
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h6>Mountain Information</h6>
                        {selectedTransaction.mountain?.mountainCoverUrl && (
                          <img
                            src={selectedTransaction.mountain.mountainCoverUrl || "/placeholder.svg"}
                            alt={selectedTransaction.mountain.name}
                            className="img-fluid rounded mb-3"
                          />
                        )}
                        <p>
                          <strong>Mountain:</strong> {selectedTransaction.mountain?.name}
                        </p>
                        <p>
                          <strong>Location:</strong> {selectedTransaction.mountain?.location}
                        </p>
                        <p>
                          <strong>Difficulty:</strong> {selectedTransaction.mountain?.difficulty}
                        </p>

                        {(selectedTransaction.paymentStatus === "ORDERED" ||
                          selectedTransaction.paymentStatus === "PENDING") &&
                          selectedTransaction.paymentUrl && (
                            <div className="mt-4">
                              <button
                                className="btn btn-primary w-100"
                                onClick={() => {
                                  handleCloseModal()
                                  handleContinuePayment(selectedTransaction.paymentUrl)
                                }}
                              >
                                <i className="bi bi-credit-card me-2"></i>Continue Payment
                              </button>
                            </div>
                          )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default MyBookingPage