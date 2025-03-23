"use client"

import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import Layout from "../components/layout/Layout"
import Loading from "../components/loading/Loading"
import { getTransactionById } from "../api/transactions"

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams()
  const [transaction, setTransaction] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Get transaction ID from URL query parameters
  const transactionId = searchParams.get("order_id") || searchParams.get("transaction_id")

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!transactionId) {
        setError("No transaction ID provided")
        setIsLoading(false)
        return
      }

      try {
        const result = await getTransactionById(transactionId)
        if (result.success) {
          setTransaction(result.transaction)
        } else {
          setError(result.message || "Failed to fetch transaction details")
        }
      } catch (error) {
        console.error("Error fetching transaction:", error)
        setError("An error occurred while fetching transaction details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransaction()
  }, [transactionId])

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

  if (isLoading) {
    return (
      <Layout>
        <div className="container mt-5 text-center">
          <Loading />
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="container mt-5">
          <div className="alert alert-danger">{error}</div>
          <Link to="/my-booking" className="btn btn-primary">
            <i className="bi bi-arrow-left me-2"></i>Go to My Bookings
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container py-5">
        <div className="text-center mb-4">
          <div className="display-1 text-success mb-3">
            <i className="bi bi-check-circle"></i>
          </div>
          <h1 className="mb-3">Payment Successful!</h1>
          <p className="lead">Your booking has been confirmed.</p>
        </div>

        {transaction && (
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0">Booking Details</h5>
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

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p className="mb-1">
                        <strong>Transaction ID:</strong> {transaction.transactionId}
                      </p>
                      <p className="mb-1">
                        <strong>Route:</strong> {transaction.route}
                      </p>
                      <p className="mb-1">
                        <strong>Start Date:</strong> {formatDate(transaction.startDate)}
                      </p>
                      <p className="mb-1">
                        <strong>End Date:</strong> {formatDate(transaction.endDate)}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1">
                        <strong>Price:</strong> {formatPrice(transaction.price)}
                      </p>
                      <p className="mb-1">
                        <strong>Status:</strong> <span className="badge bg-success">PAID</span>
                      </p>
                      <p className="mb-1">
                        <strong>Transaction Date:</strong> {formatDate(transaction.transactionDate)}
                      </p>
                    </div>
                  </div>

                  <div className="alert alert-info mb-0">
                    <i className="bi bi-info-circle me-2"></i>A confirmation email has been sent to your registered
                    email address.
                  </div>
                </div>
              </div>

              <div className="d-grid gap-2">
                <Link to="/my-booking" className="btn btn-primary">
                  <i className="bi bi-list-check me-2"></i>View All Bookings
                </Link>
                <Link to="/" className="btn btn-outline-secondary">
                  <i className="bi bi-house me-2"></i>Back to Home
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default PaymentSuccessPage