import React, { useState } from "react";

const RangersTable = ({ data, itemsPerPage }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRanger, setSelectedRanger] = useState(null); // State untuk menyimpan ranger yang dipilih
  const [showDetailModal, setShowDetailModal] = useState(false); // State untuk menampilkan modal detail

  // Filter data berdasarkan searchQuery
  const filteredData = data.rangers.filter(
    (ranger) =>
      ranger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ranger.contact_info.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginate data yang sudah difilter
  const paginateData = (items, currentPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  // Hitung total halaman berdasarkan data yang sudah difilter
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Fungsi untuk menampilkan detail ranger
  const handleViewDetail = (ranger) => {
    setSelectedRanger(ranger);
    setShowDetailModal(true);
  };

  // Fungsi untuk menutup modal detail
  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedRanger(null);
  };

  // Fungsi untuk menghapus ranger
  const handleDeleteRanger = (rangerId) => {
    if (window.confirm("Are you sure you want to delete this ranger?")) {
      // Lakukan penghapusan ranger di sini (misalnya, panggil API atau update state)
      alert(`Ranger with ID ${rangerId} deleted.`);
    }
  };

  // Fungsi untuk mengedit ranger
  const handleEditRanger = (rangerId) => {
    // Lakukan navigasi ke halaman edit atau tampilkan modal edit
    alert(`Edit ranger with ID ${rangerId}.`);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">Rangers</h2>

      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by ranger name or contact..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset ke halaman 1 saat melakukan pencarian
          }}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Mountain ID</th>
              <th>Ranger Name</th>
              <th>Contact</th>
              <th>Assigned At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginateData(filteredData, currentPage).map((ranger) => (
              <tr key={ranger.id}>
                <td>{ranger.id}</td>
                <td>{ranger.mountain_id}</td>
                <td>{ranger.name}</td>
                <td>{ranger.contact_info}</td>
                <td>{ranger.assigned_at}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm me-2"
                    onClick={() => handleViewDetail(ranger)}
                  >
                    👁️
                  </button>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEditRanger(ranger.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteRanger(ranger.id)}
                  >
                    Delete
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

      {/* Modal Detail */}
      {showDetailModal && selectedRanger && (
        <div className="modal" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Ranger Detail</h5>
                <button type="button" className="btn-close" onClick={handleCloseDetailModal}></button>
              </div>
              <div className="modal-body">
                <p><strong>ID:</strong> {selectedRanger.id}</p>
                <p><strong>Mountain ID:</strong> {selectedRanger.mountain_id}</p>
                <p><strong>Name:</strong> {selectedRanger.name}</p>
                <p><strong>Contact:</strong> {selectedRanger.contact_info}</p>
                <p><strong>Assigned At:</strong> {selectedRanger.assigned_at}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseDetailModal}>
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

export default RangersTable;