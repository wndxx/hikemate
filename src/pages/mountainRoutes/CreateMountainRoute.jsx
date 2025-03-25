"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { createMountainRoute } from "../../api/mountainRoutes"
import { getAllMountains } from "../../api/mountains"
import { getAllRoutes } from "../../api/routes"
import { Link } from "react-router-dom"
import Loading from "../../components/loading/Loading"

const CreateMountainRoute = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [mountains, setMountains] = useState([])
  const [routes, setRoutes] = useState([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  // Form data state
  const [formData, setFormData] = useState({
    mountainId: "",
    routeId: "",
    isActive: true,
  })

  // Fetch mountains and routes on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true)
      try {
        const [mountainsResult, routesResult] = await Promise.all([getAllMountains(), getAllRoutes()])

        if (mountainsResult.success) {
          setMountains(mountainsResult.mountains || [])
        }

        if (routesResult.success) {
          setRoutes(routesResult.routes || [])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("An error occurred while fetching data")
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()
  }, [])

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await createMountainRoute(formData)

      if (result.success) {
        setShowSuccess(true)
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate("/dashboard/mountain-routes")
        }, 2000)
      } else {
        setError(result.message || "Failed to create mountain route")
      }
    } catch (error) {
      console.error("Error creating mountain route:", error)
      setError("An error occurred while creating the mountain route")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="container-fluid p-0">
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
                Buat Rute Gunung
              </li>
            </ol>
          </nav>
        </div>
        <div className="px-4 pb-4">
          <div className="text-center py-5">
            <Loading />
            <p className="mt-3">Loading data...</p>
          </div>
        </div>
      </div>
    )
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
              Buat Rute Gunung
            </li>
          </ol>
        </nav>
      </div>

      <div className="px-4 pb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Buat Rute Gunung Baru</h2>
          <Link to="/dashboard/mountain-routes" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-2"></i>Kembali Ke Rute Gunung
          </Link>
        </div>

        {showSuccess ? (
          <div className="card shadow-sm">
            <div className="card-body text-center py-5">
              <div className="mb-4">
                <i className="bi bi-check-circle-fill text-success display-1"></i>
              </div>
              <h3 className="mb-2">Sukses Membuat Rute Gunung!</h3>
              <p className="text-muted mb-4">Rute Gunung Baru Sudah Berhasil Ditambahkan Di Database!</p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/dashboard/mountain-routes" className="btn btn-primary">
                  Kembali Ke Daftar Rute Gunung
                </Link>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    setShowSuccess(false)
                    // Reset form
                    setFormData({
                      mountainId: "",
                      routeId: "",
                      isActive: true,
                    })
                  }}
                >
                  Buat Rute Gunung Lain
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card shadow-sm">
            <div className="card-body">
              {error && (
                <div className="alert alert-danger mb-4">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="card mb-4">
                      <div className="card-header bg-light">
                        <h5 className="mb-0">Informasi Rute Gunung</h5>
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label htmlFor="mountainId" className="form-label">
                              Gunung <span className="text-danger">*</span>
                            </label>
                            {mountains.length > 0 ? (
                              <select
                                className="form-select"
                                id="mountainId"
                                name="mountainId"
                                value={formData.mountainId}
                                onChange={handleInputChange}
                                required
                              >
                                <option value="">Pilih Gunung</option>
                                {mountains.map((mountain) => (
                                  <option key={mountain.id} value={mountain.id}>
                                    {mountain.name}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <div className="alert alert-warning">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                Gunung Tidak Tersedia!. Silahkan Buat Gunung Terlebih Dahulu!.
                              </div>
                            )}
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="routeId" className="form-label">
                              Rute <span className="text-danger">*</span>
                            </label>
                            {routes.length > 0 ? (
                              <select
                                className="form-select"
                                id="routeId"
                                name="routeId"
                                value={formData.routeId}
                                onChange={handleInputChange}
                                required
                              >
                                <option value="">Pilih Rute</option>
                                {routes.map((route) => (
                                  <option key={route.id} value={route.id}>
                                    {route.routeName}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <div className="alert alert-warning">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                Rute Tidak Tersedia. Silahkan Buat Rute Terlebih Dahulu!.
                              </div>
                            )}
                          </div>
                          <div className="col-md-12">
                            <div className="form-check form-switch mt-2">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                              />
                              <label className="form-check-label" htmlFor="isActive">
                                Aktif
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Link to="/dashboard/mountain-routes" className="btn btn-secondary">
                    Batal
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || !formData.mountainId || !formData.routeId}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Membuat...
                      </>
                    ) : (
                      "Create Mountain Route"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateMountainRoute