import React, { useState } from "react";

const RangersTable = ({ data, itemsPerPage }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRanger, setSelectedRanger] = useState(null); // State untuk menyimpan ranger yang dipilih
  const [showDetailModal, setShowDetailModal] = useState(false); // State untuk menampilkan modal detail
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [rangerToDelete, setRangerToDelete] = useState(null);
  const [editRanger, setEditRanger] = useState({
    id: "",
    mountain_id: "",
    name: "",
    contact_info: "",
    assigned_at: "",
  });

  // Filter data berdasarkan searchQuery
  const filteredData = data.rangers.filter((ranger) => ranger.name.toLowerCase().includes(searchQuery.toLowerCase()) || ranger.contact_info.toLowerCase().includes(searchQuery.toLowerCase()));

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
  const handleDeleteRanger = (ranger) => {
    setRangerToDelete(ranger);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setRangerToDelete(null);
  };

  // Fungsi untuk mengedit ranger
  const handleEditRanger = (ranger) => {
    setEditRanger(ranger); // Set data yang akan diedit
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditRanger({
      id: "",
      mountain_id: "",
      name: "",
      contact_info: "",
      assigned_at: "",
    });
  };

  const handleUpdateRanger = async () => {
    try {
      const response = await fetch(`http://localhost:5000/rangers/${editRanger.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editRanger),
      });

      if (response.ok) {
        setShowSuccessModal(true);
        handleCloseEditModal();
      } else {
        const errorData = await response.text();
        console.error("Failed to update ranger:", errorData);
        alert("Failed to update ranger.");
      }
    } catch (error) {
      console.error("Error updating ranger:", error);
      alert("An error occurred while updating ranger.");
    }
  };

  const confirmDeleteRanger = async () => {
    if (rangerToDelete) {
      try {
        const response = await fetch(`http://localhost:5000/rangers/${rangerToDelete.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setShowSuccessModal(true);
          handleCloseDeleteModal();
        } else {
          const errorData = await response.text();
          console.error("Failed to delete ranger:", errorData);
          alert("Failed to delete ranger.");
        }
      } catch (error) {
        console.error("Error deleting ranger:", error);
        alert("An error occurred while deleting ranger.");
      }
    }
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
              <th>Mountain</th>
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
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditRanger(ranger)}>
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button className="btn btn-danger btn-sm me-2" onClick={() => handleDeleteRanger(ranger)}>
                    <i className="bi bi-trash"></i>
                  </button>
                  <button className="btn btn-info btn-sm" onClick={() => handleViewDetail(ranger)}>
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
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} className="page-link" disabled={currentPage === 1}>
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
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} className="page-link" disabled={currentPage === totalPages}>
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
                <p>
                  <strong>ID:</strong> {selectedRanger.id}
                </p>
                <p>
                  <strong>Mountain ID:</strong> {selectedRanger.mountain_id}
                </p>
                <p>
                  <strong>Name:</strong> {selectedRanger.name}
                </p>
                <p>
                  <strong>Contact:</strong> {selectedRanger.contact_info}
                </p>
                <p>
                  <strong>Assigned At:</strong> {selectedRanger.assigned_at}
                </p>
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

      {/* Modal Edit */}
      {showEditModal && (
        <div className="modal" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Ranger</h5>
                <button type="button" className="btn-close" onClick={handleCloseEditModal}></button>
              </div>
              <div className="modal-body">
                <div className="card">
                  <div className="card-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Mountain ID</label>
                        <input type="text" className="form-control" name="mountain_id" value={editRanger.mountain_id} onChange={(e) => setEditRanger({ ...editRanger, mountain_id: e.target.value })} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control" name="name" value={editRanger.name} onChange={(e) => setEditRanger({ ...editRanger, name: e.target.value })} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Contact Info</label>
                        <input type="text" className="form-control" name="contact_info" value={editRanger.contact_info} onChange={(e) => setEditRanger({ ...editRanger, contact_info: e.target.value })} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Assigned At</label>
                        <input type="text" className="form-control" name="assigned_at" value={editRanger.assigned_at} onChange={(e) => setEditRanger({ ...editRanger, assigned_at: e.target.value })} />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseEditModal}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateRanger}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete */}
      {showDeleteModal && rangerToDelete && (
        <div className="modal" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Ranger</h5>
                <button type="button" className="btn-close" onClick={handleCloseDeleteModal}></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete <strong>{rangerToDelete.name}</strong>?
                </p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseDeleteModal}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={confirmDeleteRanger}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Success */}
      {showSuccessModal && (
        <div className="modal" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Success</h5>
                <button type="button" className="btn-close" onClick={() => setShowSuccessModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Operation successful!</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={() => setShowSuccessModal(false)}>
                  OK
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
