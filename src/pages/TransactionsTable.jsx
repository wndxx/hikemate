import React, { useState, useEffect } from "react";
import { getAllTransactions } from "../api/transactions";

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalElements: 0,
    hasNext: false,
    hasPrevious: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch transactions with pagination
  const fetchTransactions = async (page = 1) => {
    setIsLoading(true);
    const result = await getAllTransactions(page, 10, "asc", "id");
    if (result.success) {
      setTransactions(result.transactions);
      setPagination(result.pagination);
    } else {
      setError(result.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter transactions based on search query and status filter
  const filteredTransactions = transactions.filter((trx) => {
    const matchesSearch =
      trx.hiker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trx.paymentStatus.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || trx.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle view details
  const handleViewDetails = (trx) => {
    setSelectedTransaction(trx);
    setShowModal(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (isLoading) {
    return <div className="text-center my-5">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center my-5">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">Recent Transactions</h2>

      {/* Search Bar and Status Filter */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by hiker name or status..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1 on search
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((trx) => (
                <tr key={trx.transactionId}>
                  <td>{trx.transactionId.substring(0, 8)}...</td>
                  <td>{trx.hiker.name}</td>
                  <td>Rp {trx.price.toLocaleString()}</td>
                  <td>{new Date(trx.transactionDate).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`badge ${
                        trx.paymentStatus === "PAID"
                          ? "bg-success"
                          : trx.paymentStatus === "ORDERED"
                          ? "bg-warning"
                          : "bg-secondary"
                      }`}
                    >
                      {trx.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => handleViewDetails(trx)}
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
                    <p><strong>ID:</strong> {selectedTransaction.transactionId}</p>
                    <p><strong>Hiker:</strong> {selectedTransaction.hiker.name}</p>
                    <p><strong>Amount:</strong> Rp {selectedTransaction.price.toLocaleString()}</p>
                    <p><strong>Date:</strong> {new Date(selectedTransaction.transactionDate).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> {selectedTransaction.paymentStatus}</p>
                    <p><strong>Route:</strong> {selectedTransaction.route}</p>
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
  );
};

export default TransactionsTable;