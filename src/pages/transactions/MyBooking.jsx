"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getUserTransactions } from "../../api/transactions"
import Loading from "../../components/loading/Loading"

const MyBookings = () => {
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch user transactions on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await getUserTransactions()
        if (result.success) {
          setTransactions(result.transactions || [])
        } else {
          setError(result.message || "Failed to fetch bookings")
        }
      } catch (error) {
        console.error("Error fetching bookings:", error)
        setError("An error occurred while fetching your bookings")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "ORDERED":
        return "bg-warning"
      case "PAID":
        return "bg-success"
      case "CANCELLED":
        return "bg-danger"
      case "COMPLETED":
        return "bg-info"
      default:
        return "bg-secondary"
    }
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">My Bookings</h2>
        <Link to="/mountains" className="btn btn-primary">
          <i className="bi bi-plus-lg me-2"></i>Book New Trip
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-5">
          <Loading />
          <p className="mt-3">Loading your bookings...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-calendar-x display-1 text-muted"></i>
            <h4 className="mt-3">No Bookings Found</h4>
            <p className="text-muted mb-4">You haven't made any bookings yet.</p>
            <Link to="/mountains" className="btn btn-primary">
              <i className="bi bi-plus-lg me-2"></i>Book Your First Trip
            </Link>
          </div>
        </div>
      ) : (
        <div className="row">
          {transactions.map((transaction) => (
            <div className="col-lg-6 mb-4" key={transaction.transactionId}>
              <div className="card shadow-sm h-100">
                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Booking #{transaction.transactionId.substring(0, 8)}</h5>
                  <span className={`badge ${getStatusBadgeClass(transaction.paymentStatus)}`}>
                    {transaction.paymentStatus}
                  </span>
                </div>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={transaction.mountain?.mountainCoverUrl || "/placeholder.svg"}
                      alt={transaction.mountain?.name}
                      className="rounded me-3"
                      style={{ width: "60px", height: "60px", objectFit: "cover" }}
                    />
                    <div>
                      <h5 className="mb-0">{transaction.mountain?.name}</h5>
                      <p className="text-muted mb-0">{transaction.mountain?.location}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="row g-2">
                      <div className="col-6">
                        <small className="text-muted d-block">Start Date</small>
                        <strong>{formatDate(transaction.startDate)}</strong>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">End Date</small>
                        <strong>{formatDate(transaction.endDate)}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted d-block">Route</small>
                    <strong>{transaction.route}</strong>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted d-block">Price</small>
                    <h5 className="text-primary mb-0">IDR {transaction.price.toLocaleString()}</h5>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted d-block">Booking Date</small>
                    <span>{formatDate(transaction.transactionDate)}</span>
                  </div>
                </div>
                <div className="card-footer bg-light">
                  <div className="d-flex justify-content-between align-items-center">
                    {transaction.paymentStatus === "ORDERED" && (
                      <a
                        href={transaction.paymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                      >
                        <i className="bi bi-credit-card me-2"></i>Pay Now
                      </a>
                    )}
                    {transaction.paymentStatus === "PAID" && !transaction.isUp && (
                      <button className="btn btn-success">
                        <i className="bi bi-arrow-up-circle me-2"></i>Check In
                      </button>
                    )}
                    {transaction.paymentStatus === "PAID" && transaction.isUp && !transaction.isDown && (
                      <button className="btn btn-info">
                        <i className="bi bi-arrow-down-circle me-2"></i>Check Out
                      </button>
                    )}
                    <Link to={`/bookings/${transaction.transactionId}`} className="btn btn-outline-secondary">
                      <i className="bi bi-eye me-2"></i>View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyBookings