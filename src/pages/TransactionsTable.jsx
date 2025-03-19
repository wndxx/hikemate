import React, { useState } from "react";

const TransactionsTable = ({ data, itemsPerPage }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // State untuk filter status
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filter data berdasarkan searchQuery dan statusFilter
  const filteredData = data.transactions.filter((trx) => {
    const matchesSearch =
      trx.hiker_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trx.status.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || trx.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Paginate data yang sudah difilter
  const paginateData = (items, currentPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  // Hitung total halaman berdasarkan data yang sudah difilter
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Fungsi untuk menangani klik detail
  const handleViewDetails = (trx) => {
    setSelectedTransaction(trx);
    setShowModal(true);
  };

  // Fungsi untuk menutup modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">Recent Transactions</h2>

      {/* Search Bar dan Status Filter */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by hiker ID or status..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset ke halaman 1 saat melakukan pencarian
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
            <button className="dropdown-item" onClick={() => setStatusFilter("completed")}>
              Completed
            </button>
          </li>
          <li>
            <button className="dropdown-item" onClick={() => setStatusFilter("pending")}>
              Pending
            </button>
          </li>
        </ul>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Hiker</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Created At</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginateData(filteredData, currentPage).map((trx) => (
              <tr key={trx.id}>
                <td>{trx.id}</td>
                <td>{trx.hiker_id}</td>
                <td>${trx.total_amount}</td>
                <td>{new Date(trx.transaction_date).toLocaleDateString()}</td>
                <td>{trx.created_at}</td>
                <td>
                  <span className={`badge ${trx.status === "completed" ? "bg-success" : "bg-warning"}`}>
                    {trx.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-info btn-sm" onClick={() => handleViewDetails(trx)}>
                    <i className="bi bi-eye"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="page-link"
              disabled={currentPage === 1}
            >
              &lt;
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
              <button onClick={() => setCurrentPage(index + 1)} className="page-link">
                {index + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="page-link"
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </li>
        </ul>
      </nav>

      {/* Modal untuk menampilkan detail transaksi */}
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
                    <p><strong>ID:</strong> {selectedTransaction.id}</p>
                    <p><strong>Hiker ID:</strong> {selectedTransaction.hiker_id}</p>
                    <p><strong>Amount:</strong> ${selectedTransaction.total_amount}</p>
                    <p><strong>Date:</strong> {new Date(selectedTransaction.transaction_date).toLocaleDateString()}</p>
                    <p><strong>Created At:</strong> {selectedTransaction.created_at}</p>
                    <p><strong>Status:</strong> {selectedTransaction.status}</p>
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