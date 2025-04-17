"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Loading from "../components/loading/Loading"
import { getAllMountains, deleteMountain } from "../api/mountains"
import TablePagination from "../components/pagination/TablePagination"
import { Link } from "react-router-dom"
import ViewMountainModal from "./ViewMountainModal"
import EditMountainModal from "./EditMountainModal"
import DeleteMountainModal from "./DeleteMountainModal"
import CreateMountainModal from "./CreateMountainModal"

const MountainsTable = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [mountains, setMountains] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalElements: 0,
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [mountainToDelete, setMountainToDelete] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
const [selectedMountainId, setSelectedMountainId] = useState(null)
const [showEditModal, setShowEditModal] = useState(false)
const [showCreateModal, setShowCreateModal] = useState(false)

  // Fetch mountains on component mount and when page changes
  useEffect(() => {
    fetchMountains()
  }, [currentPage])

  // Fetch mountains from API
  const fetchMountains = async (page = currentPage, name = searchQuery) => {
    setIsLoading(true)
    try {
      const result = await getAllMountains(page, 10, "asc", "id", name)
      if (result.success) {
        setMountains(result.mountains || [])
        setPagination(
          result.pagination || {
            page: 1,
            totalPages: 1,
            totalElements: 0,
          },
        )
      } else {
        console.error("Failed to fetch mountains:", result.message)
        setMountains([])
        setPagination({
          page: 1,
          totalPages: 1,
          totalElements: 0,
        })
      }
    } catch (error) {
      console.error("Error in fetchMountains:", error)
      setMountains([])
      setPagination({
        page: 1,
        totalPages: 1,
        totalElements: 0,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Filter mountains based on status
  const filteredMountains = mountains.filter((mountain) => statusFilter === "" || mountain.status === statusFilter)

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Handle search form submit
  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchMountains(1, searchQuery)
  }

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value)
  }

  // Handle view detail
  const handleViewDetail = (mountain) => {
    setSelectedMountainId(mountain.id)
    setShowViewModal(true)
  }

  // Handle edit mountain
  const handleEditMountain = (mountain) => {
    setSelectedMountainId(mountain.id)
    setShowEditModal(true)
  }

  // Handle delete mountain
  const handleDeleteMountain = (mountain) => {
    setMountainToDelete(mountain)
    setShowDeleteModal(true)
  }

  // Close delete modal
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
    setMountainToDelete(null)
  }

  // Confirm delete mountain
  const confirmDeleteMountain = async () => {
    if (!mountainToDelete) return

    setIsDeleting(true)
    try {
      const result = await deleteMountain(mountainToDelete.id)
      if (result.success) {
        setShowSuccessModal(true)
        handleCloseDeleteModal()
        fetchMountains() // Refresh the list
      } else {
        alert(result.message || "Failed to delete mountain")
      }
    } catch (error) {
      console.error("Error deleting mountain:", error)
      alert("An error occurred while deleting the mountain")
    } finally {
      setIsDeleting(false)
    }
  }

  // Format price to IDR
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Mountains Management</h2>
        <button 
  onClick={() => setShowCreateModal(true)} 
  className="btn btn-primary"
>
  <i className="bi bi-plus-lg me-2"></i>Add New Mountain
</button>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-3">
        <div className="row g-3">
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              aria-label="Filter by status"
            >
              <option value="">All Statuses</option>
              <option value="SAFE">Safe</option>
              <option value="OPEN">Open</option>
              <option value="WARNING">Warning</option>
              <option value="DANGEROUS">Dangerous</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mountains Table */}
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
                <th>Image</th>
                <th>Name</th>
                <th>Location</th>
                <th>Status</th>
                <th>Price</th>
                <th>Quota</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMountains.length > 0 ? (
                filteredMountains.map((mountain, index) => (
                  <tr key={mountain.id}>
                    <td>{index + 1 + (pagination.page - 1) * 10}</td>
                    <td>
                      {mountain.mountainCoverUrl ? (
                        <img
                          src={mountain.mountainCoverUrl || "/placeholder.svg"}
                          alt={mountain.name}
                          className="img-thumbnail"
                          style={{ width: "60px", height: "60px", objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          className="bg-light d-flex align-items-center justify-content-center"
                          style={{ width: "60px", height: "60px" }}
                        >
                          <i className="bi bi-image text-muted"></i>
                        </div>
                      )}
                    </td>
                    <td>{mountain.name}</td>
                    <td>{mountain.location}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          mountain.status === "SAFE"
                            ? "success"
                            : mountain.status === "OPEN"
                              ? "success"
                              : mountain.status === "WARNING"
                                ? "warning"
                                : mountain.status === "DANGEROUS"
                                  ? "danger"
                                  : "secondary"
                        }`}
                      >
                        {mountain.status}
                      </span>
                    </td>
                    <td>{formatPrice(mountain.price)}</td>
                    <td>{mountain.quotaLimit}</td>
                    <td>
                      <button
                        className="btn btn-info btn-sm me-2"
                        onClick={() => handleViewDetail(mountain)}
                        title="View Details"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteMountain(mountain)}
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No mountains found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <TablePagination pagination={pagination} onPageChange={(page) => fetchMountains(page, searchQuery)} />
      )}
      {showViewModal && (
  <ViewMountainModal 
    mountainId={selectedMountainId} 
    onClose={() => setShowViewModal(false)} 
  />
)}

{showEditModal && (
  <EditMountainModal 
    mountainId={selectedMountainId} 
    onClose={() => setShowEditModal(false)}
    onSuccess={() => fetchMountains()} // Refresh the table after successful edit
  />
)}

{showCreateModal && (
  <CreateMountainModal 
    onClose={() => setShowCreateModal(false)}
    onSuccess={() => {
      fetchMountains() // Refresh the table after successful creation
      setCurrentPage(1) // Reset to first page
    }}
  />
)}

      {/* Delete Mountain Modal */}
      <DeleteMountainModal
        show={showDeleteModal}
        mountain={mountainToDelete}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteMountain}
        isDeleting={isDeleting}
      />

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Success</h5>
                <button type="button" className="btn-close" onClick={() => setShowSuccessModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="text-center py-4">
                  <div className="mb-3">
                    <i className="bi bi-check-circle-fill text-success display-1"></i>
                  </div>
                  <h5>Mountain deleted successfully!</h5>
                </div>
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

export default MountainsTable