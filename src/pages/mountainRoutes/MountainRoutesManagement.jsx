"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getAllMountainRoutes, deleteMountainRoute } from "../../api/mountainRoutes"
import { getAllMountains } from "../../api/mountains"
import { getAllRoutes } from "../../api/routes"
import Loading from "../../components/loading/Loading"

const MountainRoutesManagement = () => {
  const [mountainRoutes, setMountainRoutes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  // Filter states
  const [mountains, setMountains] = useState([])
  const [routes, setRoutes] = useState([])
  const [selectedMountainId, setSelectedMountainId] = useState("")
  const [selectedRouteId, setSelectedRouteId] = useState("")
  const [isLoadingFilters, setIsLoadingFilters] = useState(false)

  // Fetch mountain routes on component mount and when filters or page changes
  useEffect(() => {
    fetchMountainRoutes()
  }, [currentPage, selectedMountainId, selectedRouteId])

  // Fetch mountains and routes for filters
  useEffect(() => {
    const fetchFilters = async () => {
      setIsLoadingFilters(true)
      try {
        // Fetch mountains
        const mountainsResult = await getAllMountains()
        if (mountainsResult.success) {
          setMountains(mountainsResult.mountains || [])
        }

        // Fetch routes
        const routesResult = await getAllRoutes()
        if (routesResult.success) {
          setRoutes(routesResult.routes || [])
        }
      } catch (error) {
        console.error("Error fetching filters:", error)
      } finally {
        setIsLoadingFilters(false)
      }
    }

    fetchFilters()
  }, [])

  const fetchMountainRoutes = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getAllMountainRoutes(
        currentPage,
        10,
        "asc",
        "id",
        selectedMountainId || null,
        selectedRouteId || null,
      )

      if (result.success) {
        setMountainRoutes(result.mountainRoutes || [])
        setTotalPages(Math.ceil((result.pagination?.totalItems || 10) / 10))
      } else {
        setError(result.message || "Failed to fetch mountain routes")
      }
    } catch (error) {
      console.error("Error fetching mountain routes:", error)
      setError("An error occurred while fetching mountain routes")
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
      const result = await deleteMountainRoute(deleteId)
      if (result.success) {
        setShowDeleteModal(false)
        // Refresh mountain routes list
        fetchMountainRoutes()
      } else {
        setDeleteError(result.message || "Failed to delete mountain route")
      }
    } catch (error) {
      console.error("Error deleting mountain route:", error)
      setDeleteError("An error occurred while deleting the mountain route")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    if (name === "mountainFilter") {
      setSelectedMountainId(value)
    } else if (name === "routeFilter") {
      setSelectedRouteId(value)
    }
    // Reset to first page when filters change
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSelectedMountainId("")
    setSelectedRouteId("")
    setCurrentPage(1)
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
              Rute Gunung
            </li>
          </ol>
        </nav>
      </div>

      <div className="px-4 pb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Manajemen Rute Gunung</h2>
          <Link to="/dashboard/mountain-routes/create" className="btn btn-primary">
            <i className="bi bi-plus-lg me-2"></i>Tambah Rute Gunung Baru
          </Link>
        </div>

        {/* Filters */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-light">
            <h5 className="mb-0">Filter</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-5">
                <label htmlFor="mountainFilter" className="form-label">
                  Filter berdasarkan Gunung
                </label>
                <select
                  className="form-select"
                  id="mountainFilter"
                  name="mountainFilter"
                  value={selectedMountainId}
                  onChange={handleFilterChange}
                  disabled={isLoadingFilters}
                >
                  <option value="">Semua Gunung</option>
                  {mountains.map((mountain) => (
                    <option key={mountain.id} value={mountain.id}>
                      {mountain.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-5">
                <label htmlFor="routeFilter" className="form-label">
                  Filter berdasarkan Rute
                </label>
                <select
                  className="form-select"
                  id="routeFilter"
                  name="routeFilter"
                  value={selectedRouteId}
                  onChange={handleFilterChange}
                  disabled={isLoadingFilters}
                >
                  <option value="">Semua Rute</option>
                  {routes.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.routeName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button className="btn btn-outline-secondary w-100" onClick={clearFilters}>
                  Reset Filter
                </button>
              </div>
            </div>
          </div>
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
                <p className="mt-3">Memuat Rute Gunung...</p>
              </div>
            ) : mountainRoutes.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-signpost-2 display-1 text-muted"></i>
                <h4 className="mt-3">Tidak Menemukan Rute Gunung</h4>
                {selectedMountainId || selectedRouteId ? (
                  <>
                    <p className="text-muted">Tidak ada rute gunung yang sesuai dengan filter yang dipilih.</p>
                    <button className="btn btn-outline-primary mt-2" onClick={clearFilters}>
                      Reset Filter
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-muted">Mulai Dengan Menambah Rute Gunung</p>
                    <Link to="/dashboard/mountain-routes/create" className="btn btn-primary mt-2">
                      <i className="bi bi-plus-lg me-2"></i>Tambah Rute Gunung Baru
                    </Link>
                  </>
                )}
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Gunung</th>
                        <th scope="col">Rute</th>
                        <th scope="col">Status</th>
                        <th scope="col">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mountainRoutes.map((mountainRoute, index) => (
                        <tr key={mountainRoute.id}>
                          <td>{(currentPage - 1) * 10 + index + 1}</td>
                          <td>
                            {mountainRoute.mountainId ? (
                              mountains.find((m) => m.id === mountainRoute.mountainId)?.name || mountainRoute.mountainId
                            ) : (
                              <span className="text-muted">N/A</span>
                            )}
                          </td>
                          <td>
                            {mountainRoute.routeName ||
                              routes.find((r) => r.id === mountainRoute.routeId)?.routeName || (
                                <span className="text-muted">N/A</span>
                              )}
                          </td>
                          <td>
                            {mountainRoute.mountainId && mountainRoute.routeId ? (
                              <span className="badge bg-success">Active</span>
                            ) : (
                              <span className="badge bg-danger">Inactive</span>
                            )}
                          </td>
                          <td>
                            <div className="btn-group">
                              <Link
                                to={`/dashboard/mountain-routes/view/${mountainRoute.id}`}
                                className="btn btn-sm btn-outline-primary"
                              >
                                <i className="bi bi-eye"></i>
                              </Link>
                              <Link
                                to={`/dashboard/mountain-routes/edit/${mountainRoute.id}`}
                                className="btn btn-sm btn-outline-secondary"
                              >
                                <i className="bi bi-pencil"></i>
                              </Link>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteClick(mountainRoute.id)}
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
                  <nav aria-label="Mountain Routes pagination" className="mt-4">
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
                <p>Apakah Kamu Yakin Ingin Menghapus Rute Gunung Ini? Tindakan Ini Tidak Dapat Dibatalkan.</p>
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

export default MountainRoutesManagement
