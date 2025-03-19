import React, { useState } from "react";

const UsersTable = ({ data, itemsPerPage }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null); // State untuk menyimpan user yang dipilih
  const [showDetailModal, setShowDetailModal] = useState(false); // State untuk menampilkan modal detail
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editUser, setEditUser] = useState({
    id: "",
    username: "",
    phone: "",
    email: "",
    created_at: "",
  });

  // Filter data berdasarkan searchQuery
  const filteredData = data.users.filter((user) => user.username.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase()));

  // Paginate data yang sudah difilter
  const paginateData = (items, currentPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  // Hitung total halaman berdasarkan data yang sudah difilter
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Fungsi untuk menampilkan detail user
  const handleViewDetail = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  // Fungsi untuk menutup modal detail
  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedUser(null);
  };

  // Fungsi untuk menghapus user
  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  // Fungsi untuk mengedit user
  const handleEditUser = (user) => {
    setEditUser(user); // Set data yang akan diedit
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditUser({
      id: "",
      username: "",
      phone: "",
      email: "",
      created_at: "",
    });
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(`http://localhost:5000/users/${editUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editUser),
      });

      if (response.ok) {
        setShowSuccessModal(true);
        handleCloseEditModal();
      } else {
        const errorData = await response.text();
        console.error("Failed to update user:", errorData);
        alert("Failed to update user.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("An error occurred while updating user.");
    }
  };

  const confirmDeleteUser = async () => {
    if (userToDelete) {
      try {
        const response = await fetch(`http://localhost:5000/users/${userToDelete.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setShowSuccessModal(true);
          handleCloseDeleteModal();
        } else {
          const errorData = await response.text();
          console.error("Failed to delete user:", errorData);
          alert("Failed to delete user.");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("An error occurred while deleting user.");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">Users</h2>

      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by username or email..."
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
              <th>Username</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginateData(filteredData, currentPage).map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
                <td>{user.created_at}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditUser(user)}>
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button className="btn btn-danger btn-sm me-2" onClick={() => handleDeleteUser(user)}>
                    <i className="bi bi-trash"></i>
                  </button>
                  <button className="btn btn-info btn-sm" onClick={() => handleViewDetail(user)}>
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
      {showDetailModal && selectedUser && (
        <div className="modal" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">User Detail</h5>
                <button type="button" className="btn-close" onClick={handleCloseDetailModal}></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>ID:</strong> {selectedUser.id}
                </p>
                <p>
                  <strong>Username:</strong> {selectedUser.username}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedUser.phone}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Created At:</strong> {selectedUser.created_at}
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
                <h5 className="modal-title">Edit User</h5>
                <button type="button" className="btn-close" onClick={handleCloseEditModal}></button>
              </div>
              <div className="modal-body">
                <div className="card">
                  <div className="card-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input type="text" className="form-control" name="username" value={editUser.username} onChange={(e) => setEditUser({ ...editUser, username: e.target.value })} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Phone</label>
                        <input type="text" className="form-control" name="phone" value={editUser.phone} onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" name="email" value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseEditModal}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateUser}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete */}
      {showDeleteModal && userToDelete && (
        <div className="modal" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete User</h5>
                <button type="button" className="btn-close" onClick={handleCloseDeleteModal}></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete <strong>{userToDelete.username}</strong>?
                </p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseDeleteModal}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={confirmDeleteUser}>
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

      {/* Modal Delete */}
      {showDeleteModal && userToDelete && (
        <div className="modal" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete User</h5>
                <button type="button" className="btn-close" onClick={handleCloseDeleteModal}></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete <strong>{userToDelete.username}</strong>?
                </p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseDeleteModal}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={confirmDeleteUser}>
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

export default UsersTable;
