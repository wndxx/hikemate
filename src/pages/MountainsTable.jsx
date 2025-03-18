import React, { useState } from "react";

const MountainsTable = ({ data, itemsPerPage }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMountain, setSelectedMountain] = useState(null); // State untuk menyimpan mountain yang dipilih
  const [showDetailModal, setShowDetailModal] = useState(false); // State untuk menampilkan modal detail

  // Filter data berdasarkan searchQuery
  const filteredData = data.mountains.filter(
    (mountain) =>
      mountain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mountain.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginate data yang sudah difilter
  const paginateData = (items, currentPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  // Hitung total halaman berdasarkan data yang sudah difilter
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Fungsi untuk menampilkan detail mountain
  const handleViewDetail = (mountain) => {
    setSelectedMountain(mountain);
    setShowDetailModal(true);
  };

  // Fungsi untuk menutup modal detail
  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedMountain(null);
  };

  // Fungsi untuk menghapus mountain
  const handleDeleteMountain = (mountainId) => {
    if (window.confirm("Are you sure you want to delete this mountain?")) {
      // Lakukan penghapusan mountain di sini (misalnya, panggil API atau update state)
      alert(`Mountain with ID ${mountainId} deleted.`);
    }
  };

  // Fungsi untuk mengedit mountain
  const handleEditMountain = (mountainId) => {
    // Lakukan navigasi ke halaman edit atau tampilkan modal edit
    alert(`Edit mountain with ID ${mountainId}.`);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">Mountains</h2>

      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name or location..."
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
              <th>Name</th>
              <th>Location</th>
              <th>Elevation</th>
              <th>Difficulty</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginateData(filteredData, currentPage).map((mountain) => (
              <tr key={mountain.id}>
                <td>{mountain.id}</td>
                <td>{mountain.name}</td>
                <td>{mountain.location}</td>
                <td>{mountain.elevation} meters</td>
                <td>{mountain.difficulty}</td>
                <td>${mountain.price}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm me-2"
                    onClick={() => handleViewDetail(mountain)}
                  >
                    👁️
                  </button>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEditMountain(mountain.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteMountain(mountain.id)}
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
      {showDetailModal && selectedMountain && (
        <div className="modal" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Mountain Detail</h5>
                <button type="button" className="btn-close" onClick={handleCloseDetailModal}></button>
              </div>
              <div className="modal-body">
                <p><strong>ID:</strong> {selectedMountain.id}</p>
                <p><strong>Name:</strong> {selectedMountain.name}</p>
                <p><strong>Location:</strong> {selectedMountain.location}</p>
                <p><strong>Elevation:</strong> {selectedMountain.elevation} meters</p>
                <p><strong>Difficulty:</strong> {selectedMountain.difficulty}</p>
                <p><strong>Price:</strong> ${selectedMountain.price}</p>
                <p><strong>Description:</strong> {selectedMountain.description}</p>
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

export default MountainsTable;