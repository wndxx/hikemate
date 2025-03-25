"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { getMountainRouteById, deleteMountainRoute } from "../../api/mountainRoutes"
import { getMountainById } from "../../api/mountains"
import { getRouteById } from "../../api/routes"
import Loading from "../../components/loading/Loading"

const ViewMountainRoute = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [mountainRoute, setMountainRoute] = useState(null)
  const [mountain, setMountain] = useState(null)
  const [route, setRoute] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Fetch mountain route details
        const mountainRouteResult = await getMountainRouteById(id)
        if (!mountainRouteResult.success) {
          setError(mountainRouteResult.message || "Failed to fetch mountain route details")
          setIsLoading(false)
          return
        }

        setMountainRoute(mountainRouteResult.mountainRoute)

        // Fetch mountain details if mountainId exists
        if (mountainRouteResult.mountainRoute.mountainId) {
          const mountainResult = await getMountainById(mountainRouteResult.mountainRoute.mountainId)
          if (mountainResult.success) {
            setMountain(mountainResult.mountain)
          }
        }

        // Fetch route details if routeId exists
        if (mountainRouteResult.mountainRoute.routeId) {
          const routeResult = await getRouteById(mountainRouteResult.mountainRoute.routeId)
          if (routeResult.success) {
            setRoute(routeResult.route)
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("An error occurred while fetching the data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
    setDeleteError(null)
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    setDeleteError(null)
    try {
      const result = await deleteMountainRoute(id)
      if (result.success) {
        // Navigate back to the mountain routes list
        navigate("/dashboard/mountain-routes")
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

  return (
    <div className="container-fluid p-0">
      {/* Breadcrumb */}
      <div className="bg-light py-3 px-4 mb-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/dashboard/mountain-routes">Rute Gunung</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Detail Rute Gunung
            </li>
          </ol>
        </nav>
      </div>

      <div className="px-4 pb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Detail Rute Gunung</h2>
          <div className="d-flex gap-2">
            <Link to="/dashboard/mountain-routes" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left me-2"></i>Kembali
            </Link>
            <Link to={`/dashboard/mountain-routes/edit/${id}`} className="btn btn-outline-primary">
              <i className="bi bi-pencil me-2"></i>Edit
            </Link>
            <button className="btn btn-outline-danger" onClick={handleDeleteClick}>
              <i className="bi bi-trash me-2"></i>Hapus
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger mb-4">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="card shadow-sm">
            <div className="card-body text-center py-5">
              <Loading />
              <p className="mt-3">Memuat detail rute gunung...</p>
            </div>
          </div>
        ) : mountainRoute ? (
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Informasi Rute Gunung</h5>
                </div>
                <div className="card-body">
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <h6 className="text-muted mb-2">ID Rute Gunung</h6>
                      <p className="mb-0">{mountainRoute.id}</p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="text-muted mb-2">Status</h6>
                      <span
                        className={`badge ${
                          mountainRoute.mountainId && mountainRoute.routeId ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {mountainRoute.mountainId && mountainRoute.routeId ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <hr />

                  <div className="row mb-4">
                    <div className="col-md-12">
                      <h5 className="mb-3">Informasi Gunung</h5>
                      {mountain ? (
                        <div className="card">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-6">
                                <h6 className="text-muted mb-2">Nama Gunung</h6>
                                <p className="mb-3">{mountain.name}</p>
                              </div>
                              <div className="col-md-6">
                                <h6 className="text-muted mb-2">Lokasi</h6>
                                <p className="mb-3">{mountain.location}</p>
                              </div>
                              <div className="col-md-6">
                                <h6 className="text-muted mb-2">Status</h6>
                                <span
                                  className={`badge ${
                                    mountain.status === "SAFE"
                                      ? "bg-success"
                                      : mountain.status === "WARNING"
                                        ? "bg-warning"
                                        : mountain.status === "DANGEROUS"
                                          ? "bg-danger"
                                          : "bg-secondary"
                                  }`}
                                >
                                  {mountain.status}
                                </span>
                              </div>
                              <div className="col-md-6">
                                <h6 className="text-muted mb-2">Harga</h6>
                                <p className="mb-0">Rp {mountain.price.toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="mt-3">
                              <Link
                                to={`/dashboard/mountains/view/${mountain.id}`}
                                className="btn btn-sm btn-outline-primary"
                              >
                                <i className="bi bi-eye me-1"></i>Lihat Detail Gunung
                              </Link>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="alert alert-warning">
                          <i className="bi bi-exclamation-triangle me-2"></i>
                          Informasi gunung tidak tersedia atau telah dihapus.
                        </div>
                      )}
                    </div>
                  </div>

                  <hr />

                  <div className="row">
                    <div className="col-md-12">
                      <h5 className="mb-3">Informasi Rute</h5>
                      {route ? (
                        <div className="card">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-6">
                                <h6 className="text-muted mb-2">Nama Rute</h6>
                                <p className="mb-3">{route.routeName}</p>
                              </div>
                              {route.difficulty && (
                                <div className="col-md-6">
                                  <h6 className="text-muted mb-2">Tingkat Kesulitan</h6>
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
                                </div>
                              )}
                              {route.estimatedTime && (
                                <div className="col-md-6">
                                  <h6 className="text-muted mb-2">Estimasi Waktu</h6>
                                  <p className="mb-0">{route.estimatedTime}</p>
                                </div>
                              )}
                              {route.description && (
                                <div className="col-md-12 mt-3">
                                  <h6 className="text-muted mb-2">Deskripsi</h6>
                                  <p className="mb-0">{route.description}</p>
                                </div>
                              )}
                            </div>
                            <div className="mt-3">
                              <Link
                                to={`/dashboard/routes/view/${route.id}`}
                                className="btn btn-sm btn-outline-primary"
                              >
                                <i className="bi bi-eye me-1"></i>Lihat Detail Rute
                              </Link>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="alert alert-warning">
                          <i className="bi bi-exclamation-triangle me-2"></i>
                          Informasi rute tidak tersedia atau telah dihapus.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card shadow-sm">
            <div className="card-body text-center py-5">
              <i className="bi bi-exclamation-circle display-1 text-muted"></i>
              <h4 className="mt-3">Rute Gunung Tidak Ditemukan</h4>
              <p className="text-muted mb-4">Rute gunung yang Anda cari tidak ditemukan atau telah dihapus.</p>
              <Link to="/dashboard/mountain-routes" className="btn btn-primary">
                Kembali ke Daftar Rute Gunung
              </Link>
            </div>
          </div>
        )}
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
                <p>Apakah Anda yakin ingin menghapus rute gunung ini? Tindakan ini tidak dapat dibatalkan.</p>
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
                    "Hapus"
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

export default ViewMountainRoute