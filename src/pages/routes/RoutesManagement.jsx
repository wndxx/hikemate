"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getAllRoutes, deleteRoute } from "../../api/routes"
import Loading from "../../components/loading/Loading"

const RoutesManagement = () => {
  const [routes, setRoutes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  // Fetch routes on component mount and when page changes
  useEffect(() => {
    fetchRoutes()
  }, [currentPage])

  const fetchRoutes = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getAllRoutes(currentPage, 10)
      if (result.success) {
        setRoutes(result.routes || [])
        setTotalPages(Math.ceil((result.pagination?.totalItems || 10) / 10))
      } else {
        setError(result.message || "Failed to fetch routes")
      }
    } catch (error) {
      console.error("Error fetching routes:", error)
      setError("An error occurred while fetching routes")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id)
    setShowDeleteModal(true)
    setDeleteError(null)
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    setDeleteError(null)
    try {
      const result = await deleteRoute(deleteId)
      if (result.success) {
        setShowDeleteModal(false)
        // Refresh routes list
        fetchRoutes()
      } else {
        setDeleteError(result.message || "Failed to delete route")
      }
    } catch (error) {
      console.error("Error deleting route:", error)
      setDeleteError("An error occurred while deleting the route")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="container-fluid p-0">
      {/* Breadcrumb */}
      <div className="bg-light py-3 px-4 mb-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Rute
            </li>
          </ol>
        </nav>
      </div>

      <div className="px-4 pb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Manajemen Rute</h2>
          <Link to="/dashboard/routes/create" className="btn btn-primary">
            <i className="bi bi-plus-lg me-2"></i>Tambah Rute Baru
          </Link>
        </div>

        {error && (
          <div className="alert alert-danger mb-4">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        <div className="card shadow-sm">
          <div className="card-body">
            {isLoading ? (
              <div className="text-center py-5">
                <Loading />
                <p className="mt-3">Memuat rute...</p>
              </div>
            ) : routes.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-signpost-2 display-1 text-muted"></i>
                <h4 className="mt-3">Rute Tidak Ditemukan</h4>
                <p className="text-muted">Mulai Menambahkan Rute Pertama.</p>
                <Link to="/dashboard/routes/create" className="btn btn-primary mt-2">
                  <i className="bi bi-plus-lg me-2"></i>Tambah Rute Baru
                </Link>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nama Rute</th>
                        <th scope="col">Deskripsi</th>
                        <th scope="col">Tingkat Kesulitan</th>
                        <th scope="col">Estimasi Waktu</th>
                        <th scope="col">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {routes.map((route, index) => (
                        <tr key={route.id}>
                          <td>{(currentPage - 1) * 10 + index + 1}</td>
                          <td>{route.routeName}</td>
                          <td>
                            {route.description && route.description.length > 50
                              ? `${route.description.substring(0, 50)}...`
                              : route.description}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                route.difficulty === "EASY"
                                  ? "bg-success"
                                  : route.difficulty === "MEDIUM"
                                    ? "bg-warning"
                                    : "bg-danger"
                              }`}
                            >
                              {route.difficulty}
                            </span>
                          </td>
                          <td>{route.estimatedTime || "N/A"}</td>
                          <td>
                            <div className="btn-group">
                              <Link
                                to={`/dashboard/routes/view/${route.id}`}
                                className="btn btn-sm btn-outline-primary"
                              >
                                <i className="bi bi-eye"></i>
                              </Link>
                              <Link
                                to={`/dashboard/routes/edit/${route.id}`}
                                className="btn btn-sm btn-outline-secondary"
                              >
                                <i className="bi bi-pencil"></i>
                              </Link>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteClick(route.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav aria-label="Routes pagination" className="mt-4">
                    <ul className="pagination justify-content-center">
                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Sebelumnya
                        </button>
                      </li>
                      {[...Array(totalPages).keys()].map((page) => (
                        <li key={page + 1} className={`page-item ${currentPage === page + 1 ? "active" : ""}`}>
                          <button className="page-link" onClick={() => handlePageChange(page + 1)}>
                            {page + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Selanjutnya
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Konfirmasi Hapus</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                ></button>
              </div>
              <div className="modal-body">
                <p>Apakah Kamu Yakin Menghapus Rute Ini? Tindakan Ini Tidak Dapat Dibatalkan.</p>
                {deleteError && (
                  <div className="alert alert-danger mt-3">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {deleteError}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                >
                  Batal
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm} disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Menghapus...
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
    </div>
  )
}

export default RoutesManagement