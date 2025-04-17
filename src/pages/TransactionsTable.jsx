"use client"

import { useState, useEffect } from "react"
import { getAllTransactions, updateTransactionStatus } from "../api/transactions"
import { useAuth } from "../context/AuthContext"
import Loading from "../components/loading/Loading"

const TransactionsTable = () => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalElements: 0,
    hasNext: false,
    hasPrevious: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(null)
  const [serverUnavailable, setServerUnavailable] = useState(false)

  // Fetch transactions with pagination
  const fetchTransactions = async (page = 1) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await getAllTransactions(page, 10, "asc", "id")
      if (result.success) {
        // Only admins should see all transactions
        if (user && user.role && user.role.includes("SUPERADMIN")) {
          setTransactions(result.transactions || [])
        } else {
          // For non-admin users, this should be empty or filtered
          // This is just a safeguard, as non-admins shouldn't access this page
          setTransactions([])
        }
        setPagination(
          result.pagination || {
            page: 1,
            totalPages: 1,
            totalElements: 0,
            hasNext: false,
            hasPrevious: false,
          },
        )
      } else {
        setError(result.message || "Failed to fetch transactions")
        setTransactions([])
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
      setError("An error occurred while fetching transactions")
      setTransactions([])

      // Check if this is a network error
      if (error.message && error.message.includes("Network Error")) {
        setServerUnavailable(true)
        setError("The server is currently unavailable. Please try again later.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [user])

  // Filter transactions based on search query and status filter
  const filteredTransactions = transactions.filter((trx) => {
    const matchesSearch =
      trx.hiker?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trx.paymentStatus?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || trx.paymentStatus === statusFilter

    return matchesSearch && matchesStatus
  })

  // Handle view details
  const handleViewDetails = (trx) => {
    setSelectedTransaction(trx)
    setShowModal(true)
  }

  // Handle close modal
  const handleCloseModal = () => {
    setShowModal(false)
  }

  // Handle close status modal
  const handleCloseStatusModal = () => {
    setShowStatusModal(false)
    setStatusUpdateSuccess(null)
  }

  // Handle status update
  const handleStatusUpdate = async (isUp, isDown) => {
    if (!selectedTransaction) return

    setIsUpdating(true)
    try {
      const result = await updateTransactionStatus(selectedTransaction.transactionId, {
        isUp,
        isDown,
      })

      if (result.success) {
        setStatusUpdateSuccess(
          `Status updated successfully: ${isUp ? "Up" : "Not Up"}, ${isDown ? "Down" : "Not Down"}`,
        )

        // Update the transaction in the local state
        setTransactions((prevTransactions) =>
          prevTransactions.map((trx) =>
            trx.transactionId === selectedTransaction.transactionId ? { ...trx, isUp, isDown } : trx,
          ),
        )

        // Update the selected transaction
        setSelectedTransaction({
          ...selectedTransaction,
          isUp,
          isDown,
        })
      } else {
        setError(result.message || "Failed to update status")
      }
    } catch (err) {
      console.error("Error updating status:", err)
      setError("An error occurred while updating status")

      // Check if this is a network error
      if (err.message && err.message.includes("Network Error")) {
        setServerUnavailable(true)
        setError("The server is currently unavailable. Please try again later.")
      }
    } finally {
      setIsUpdating(false)
    }
  }

  if (serverUnavailable) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h4 className="alert-heading">Server Unavailable</h4>
          <p>The server is currently unavailable. Please try again later.</p>
          <hr />
          <p className="mb-0">This could be due to maintenance or network issues.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <Loading />
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">All Transactions</h2>

      {error && (
        <div className="alert alert-warning mb-3">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* Search Bar and Status Filter */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by hiker name or status..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setPagination((prev) => ({ ...prev, page: 1 })) // Reset to page 1 on search
          }}
        />
        <button
          className="btn btn-outline-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {statusFilter === "all" ? "All Status" : statusFilter}
        </button>
        <ul className="dropdown-menu dropdown-menu-end">
          <li>
            <button className="dropdown-item" onClick={() => setStatusFilter("all")}>
              All Status
            </button>
          </li>
          <li>
            <button className="dropdown-item" onClick={() => setStatusFilter("ORDERED")}>
              Ordered
            </button>
          </li>
          <li>
            <button className="dropdown-item" onClick={() => setStatusFilter("PAID")}>
              Paid
            </button>
          </li>
        </ul>
      </div>

      {/* Transactions Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Hiker</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Up/Down</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((trx) => (
                <tr key={trx.id}>
                  <td>{trx.id.substring(0, 8)}</td>
                  <td>{trx.hiker_id}</td>
                  <td>Rp {trx.total_amount?.toLocaleString()}</td>
                  <td>{new Date(trx.transaction_date).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`badge ${
                        trx.status === "completed"
                          ? "bg-success"
                          : trx.status === "pending"
                            ? "bg-warning"
                            : "bg-secondary"
                      }`}
                    >
                      {trx.status}
                    </span>
                  </td>
                  <td>
                    <span className={`badge bg-secondary me-1`}>Not Available</span>
                  </td>
                  <td>
                    <button className="btn btn-info btn-sm me-2" onClick={() => handleViewDetails(trx)}>
                      <i className="bi bi-eye"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  {error ? "Error loading transactions" : "No transactions found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${!pagination.hasPrevious ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => fetchTransactions(pagination.page - 1)}
                disabled={!pagination.hasPrevious}
              >
                &lt;
              </button>
            </li>
            {[...Array(pagination.totalPages)].map((_, index) => (
              <li key={index} className={`page-item ${pagination.page === index + 1 ? "active" : ""}`}>
                <button className="page-link" onClick={() => fetchTransactions(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${!pagination.hasNext ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => fetchTransactions(pagination.page + 1)}
                disabled={!pagination.hasNext}
              >
                &gt;
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Modal for Transaction Details */}
      {showModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Transaction Details</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                {selectedTransaction && (
                  <div>
                    <p>
                      <strong>ID:</strong> {selectedTransaction.transactionId}
                    </p>
                    <p>
                      <strong>Hiker:</strong> {selectedTransaction.hiker?.name}
                    </p>
                    <p>
                      <strong>Amount:</strong> Rp {selectedTransaction.price?.toLocaleString()}
                    </p>
                    <p>
                      <strong>Date:</strong> {new Date(selectedTransaction.transactionDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Status:</strong> {selectedTransaction.paymentStatus}
                    </p>
                    <p>
                      <strong>Route:</strong> {selectedTransaction.route}
                    </p>
                    <p>
                      <strong>Up Status:</strong>{" "}
                      <span className={`badge ${selectedTransaction.isUp ? "bg-success" : "bg-secondary"}`}>
                        {selectedTransaction.isUp ? "Up" : "Not Up"}
                      </span>
                    </p>
                    <p>
                      <strong>Down Status:</strong>{" "}
                      <span className={`badge ${selectedTransaction.isDown ? "bg-info" : "bg-secondary"}`}>
                        {selectedTransaction.isDown ? "Down" : "Not Down"}
                      </span>
                    </p>
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

      {/* Modal for Status Update */}
      {showStatusModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Hiker Status</h5>
                <button type="button" className="btn-close" onClick={handleCloseStatusModal}></button>
              </div>
              <div className="modal-body">
                {selectedTransaction && (
                  <div>
                    <p>
                      <strong>Transaction ID:</strong> {selectedTransaction.transactionId}
                    </p>
                    <p>
                      <strong>Hiker:</strong> {selectedTransaction.hiker?.name}
                    </p>
                    <p>
                      <strong>Mountain:</strong> {selectedTransaction.mountain?.name}
                    </p>

                    <div className="alert alert-info">
                      <p className="mb-0">
                        <strong>Current Status:</strong>{" "}
                        <span className={`badge ${selectedTransaction.isUp ? "bg-success" : "bg-secondary"} me-2`}>
                          {selectedTransaction.isUp ? "Up" : "Not Up"}
                        </span>
                        <span className={`badge ${selectedTransaction.isDown ? "bg-info" : "bg-secondary"}`}>
                          {selectedTransaction.isDown ? "Down" : "Not Down"}
                        </span>
                      </p>
                    </div>

                    {statusUpdateSuccess && <div className="alert alert-success">{statusUpdateSuccess}</div>}

                    <div className="mt-4">
                      <h6>Update Status:</h6>
                      <div className="d-flex flex-column gap-3 mt-3">
                        <button
                          className="btn btn-success"
                          onClick={() => handleStatusUpdate(true, false)}
                          disabled={isUpdating || (selectedTransaction.isUp && !selectedTransaction.isDown)}
                        >
                          {isUpdating ? <Loading /> : "Mark as Up (Started Climbing)"}
                        </button>

                        <button
                          className="btn btn-info"
                          onClick={() => handleStatusUpdate(true, true)}
                          disabled={isUpdating || !selectedTransaction.isUp}
                        >
                          {isUpdating ? <Loading /> : "Mark as Down (Finished Climbing)"}
                        </button>

                        <button
                          className="btn btn-secondary"
                          onClick={() => handleStatusUpdate(false, false)}
                          disabled={isUpdating}
                        >
                          {isUpdating ? <Loading /> : "Reset Status"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseStatusModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TransactionsTable
