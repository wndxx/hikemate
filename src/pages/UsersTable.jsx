"use client"

import { useState, useEffect } from "react"
import Loading from "../components/loading/Loading"
import { getAllHikers, getHikerById } from "../api/hikers"
import TablePagination from "../components/pagination/TablePagination"

const UsersTable = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [editUser, setEditUser] = useState({
    id: "",
    username: "",
    phone: "",
    email: "",
    created_at: "",
  })
  const [hikers, setHikers] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalElements: 0,
  })

  // Fetch hikers on component mount and when page changes
  useEffect(() => {
    fetchHikers()
  }, [currentPage])

  // Fetch hikers from API
  const fetchHikers = async (page = currentPage) => {
    setIsLoading(true)
    try {
      const result = await getAllHikers(page, 10)
      if (result.success) {
        setHikers(result.hikers)
        setPagination(result.pagination)
      } else {
        console.error("Failed to fetch hikers:", result.message)
      }
    } catch (error) {
      console.error("Error fetching hikers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter hikers based on search query
  const filteredHikers = hikers.filter(
    (hiker) =>
      hiker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hiker.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hiker.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Handle view detail
  const handleViewDetail = async (hiker) => {
    setIsLoading(true)
    try {
      const result = await getHikerById(hiker.id)
      if (result.success) {
        setSelectedUser(result.hiker)
        setShowDetailModal(true)
      } else {
        alert(result.message || "Failed to fetch hiker details")
      }
    } catch (error) {
      console.error("Error fetching hiker details:", error)
      alert("An error occurred while fetching hiker details")
    } finally {
      setIsLoading(false)
    }
  }

  // Close detail modal
  const handleCloseDetailModal = () => {
    setShowDetailModal(false)
    setSelectedUser(null)
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Fungsi untuk menghapus user
  const handleDeleteUser = (user) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
  }

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
    setUserToDelete(null)
  }

  const confirmDeleteUser = async () => {
    setIsLoading(true)
    if (userToDelete) {
      try {
        const response = await fetch(`http://localhost:5000/users/${userToDelete.id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          setShowSuccessModal(true)
          handleCloseDeleteModal()
        } else {
          const errorData = await response.text()
          console.error("Failed to delete user:", errorData)
          alert("Failed to delete user.")
        }
      } catch (error) {
        console.error("Error deleting user:", error)
        alert("An error occurred while deleting user.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">Hikers Management</h2>

      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, email or phone..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Hikers Table */}
      {isLoading ? (
        <div className="text-center my-5">
          <Loading />
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHikers.length > 0 ? (
                filteredHikers.map((hiker, index) => (
                  <tr key={hiker.id}>
                    <td>{index + 1 + (pagination.page - 1) * 10}</td>
                    <td>{hiker.username}</td>
                    <td>{hiker.email}</td>
                    <td>{hiker.phone || "N/A"}</td>
                    <td>{formatDate(hiker.created_at || new Date().toISOString())}</td>
                    <td>
                      <button className="btn btn-danger btn-sm me-2" onClick={() => handleDeleteUser(hiker)}>
                        <i className="bi bi-trash"></i>
                      </button>
                      <button
                        className="btn btn-info btn-sm "
                        onClick={() => handleViewDetail(hiker)}
                        title="View Details"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No hikers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <TablePagination pagination={pagination} onPageChange={(page) => fetchHikers(page)} />
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Hiker Details</h5>
                <button type="button" className="btn-close" onClick={handleCloseDetailModal}></button>
              </div>
              <div className="modal-body">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{selectedUser.name}</h5>
                    <p className="card-text">
                      <strong>ID:</strong> {selectedUser.id}
                    </p>
                    <p className="card-text">
                      <strong>Email:</strong> {selectedUser.email}
                    </p>
                    <p className="card-text">
                      <strong>Phone Number:</strong> {selectedUser.phoneNumber}
                    </p>
                    <p className="card-text">
                      <strong>Created At:</strong> {formatDate(selectedUser.createdAt)}
                    </p>
                    <p className="card-text">
                      <strong>Updated At:</strong> {formatDate(selectedUser.updatedAt)}
                    </p>
                  </div>
                </div>
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
                <button type="button" className="btn btn-danger" onClick={confirmDeleteUser} disabled={isLoading}>
                  {isLoading ? <Loading /> : "Delete"}
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
  )
}

export default UsersTable
