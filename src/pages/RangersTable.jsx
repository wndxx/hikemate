"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getAllRangers } from "../api/rangers"
import Loading from "../components/loading/Loading"
import TablePagination from "../components/pagination/TablePagination"

const RangersTable = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [rangers, setRangers] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalElements: 0,
    hasNext: false,
    hasPrevious: false,
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [rangerToDelete, setRangerToDelete] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    fetchRangers()
  }, [currentPage])

  const fetchRangers = async (page = currentPage) => {
    setIsLoading(true)
    try {
      const result = await getAllRangers(page, 10)
      if (result.success) {
        setRangers(result.rangers)
        setPagination(result.pagination)
      } else {
        console.error("Failed to fetch rangers:", result.message)
      }
    } catch (error) {
      console.error("Error fetching rangers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredRangers = rangers.filter(
    (ranger) =>
      ranger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ranger.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ranger.mountainResponse?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleViewDetail = (ranger) => {
    navigate(`/ranger/${ranger.id}`)
  }

  // Update the formatDate function to handle the ranger data format from db.json
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
    setRangerToDelete(null)
  }

  const confirmDeleteRanger = async () => {
    setIsDeleting(true)
    // try {
    //   await deleteRanger(rangerToDelete.id)
    //   setRangers(rangers.filter((ranger) => ranger.id !== rangerToDelete.id))
    //   setShowDeleteModal(false)
    //   setShowSuccessModal(true)
    // } catch (error) {
    //   console.error("Error deleting ranger:", error)
    // } finally {
    setIsDeleting(false)
    setShowDeleteModal(false)
    setShowSuccessModal(true)
    fetchRangers()
    // }
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">Rangers Management</h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, phone number or mountain..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

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
                <th>Phone Number</th>
                <th>Mountain</th>
                <th>Assigned At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRangers.length > 0 ? (
                filteredRangers.map((ranger, index) => (
                  <tr key={ranger.id}>
                    <td>{index + 1 + (pagination.page - 1) * 10}</td>
                    <td>{ranger.name}</td>
                    <td>{ranger.contact_info}</td>
                    <td>{ranger.mountain_id || "Not assigned"}</td>
                    <td>{formatDate(ranger.assigned_at)}</td>
                    <td>
                      <button
                        className="btn btn-info btn-sm me-2"
                        onClick={() => handleViewDetail(ranger)}
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
                    No rangers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {pagination.totalPages > 1 && (
        <TablePagination pagination={pagination} onPageChange={(page) => fetchRangers(page)} />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && rangerToDelete && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Ranger</h5>
                <button type="button" className="btn-close" onClick={handleCloseDeleteModal}></button>
              </div>
              <div className="modal-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-light rounded-circle p-3 me-3">
                    <i className="bi bi-person-fill fs-3"></i>
                  </div>
                  <div>
                    <h5 className="mb-1">{rangerToDelete.name}</h5>
                    <p className="text-muted mb-0">Assigned Ranger</p>
                  </div>
                </div>
                <p>Are you sure you want to delete this ranger? This action cannot be undone.</p>
                <div className="alert alert-warning">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Warning: Deleting this ranger will remove all their assignments and related data.
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseDeleteModal}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={confirmDeleteRanger} disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  <h5>Ranger deleted successfully!</h5>
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

export default RangersTable
