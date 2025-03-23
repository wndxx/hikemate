"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Layout from "../components/layout/Layout"
import Loading from "../components/loading/Loading"
import { getUserTransactions } from "../api/transactions"
import { useAuth } from "../context/AuthContext"

const MyBookingPage = () => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("active") // active, completed, cancelled

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    setIsLoading(true)
    try {
      const result = await getUserTransactions()
      if (result.success) {
        console.log("User transactions:", result.transactions)
        setTransactions(result.transactions || [])
      } else {
        console.warn("Warning fetching transactions:", result.message)
        // Don't set error, just set empty transactions
        setTransactions([])
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
      // Don't set error, just set empty transactions
      setTransactions([])
    } finally {
      setIsLoading(false)
    }
  }

  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter((transaction) => {
    if (activeTab === "active") {
      return transaction.paymentStatus === "ORDERED"
    } else if (activeTab === "completed") {
      return transaction.paymentStatus === "PAID"
    } else {
      return transaction.paymentStatus !== "ORDERED" && transaction.paymentStatus !== "PAID"
    }
  })

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
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Handle payment continuation - open in new tab
  const handleContinuePayment = (paymentUrl) => {
    window.open(paymentUrl, "_blank")
  }

  return (
    <Layout>
      <div className="container py-5">
        <h1 className="text-center mb-4">My Bookings</h1>

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
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "completed" ? "active" : ""}`}
              onClick={() => setActiveTab("completed")}
            >
              Completed
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "cancelled" ? "active" : ""}`}
              onClick={() => setActiveTab("cancelled")}
            >
              Cancelled/Failed
            </button>
          </li>
        </ul>

        {isLoading ? (
          <div className="text-center py-5">
            <Loading />
          </div>
        ) : filteredTransactions.length > 0 ? (
          <div className="row">
            {filteredTransactions.map((transaction) => (
              <div className="col-md-6 mb-4" key={transaction.transactionId}>
                <div className="card shadow-sm h-100">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Booking #{transaction.transactionId.substring(0, 8)}</h5>
                    <span
                      className={`badge ${
                        transaction.paymentStatus === "PAID"
                          ? "bg-success"
                          : transaction.paymentStatus === "ORDERED"
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

                    {transaction.paymentStatus === "ORDERED" && transaction.paymentUrl && (
                      <div className="d-grid">
                        <button
                          className="btn btn-primary"
                          onClick={() => handleContinuePayment(transaction.paymentUrl)}
                        >
                          <i className="bi bi-credit-card me-2"></i>Continue Payment
                        </button>
                      </div>
                    )}
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
      </div>
    </Layout>
  )
}

export default MyBookingPage

