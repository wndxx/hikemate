"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { createMountainRoute } from "../../api/mountainRoutes"
import { getAllMountains } from "../../api/mountains"
import { getAllRoutes } from "../../api/routes"
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
  })

  // Fetch mountains and routes on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true)
      try {
        // Fetch mountains
        const mountainsResult = await getAllMountains()
        if (mountainsResult.success) {
          setMountains(mountainsResult.mountains || [])
        } else {
          console.error("Failed to fetch mountains:", mountainsResult.message)
        }

        // Fetch routes
        const routesResult = await getAllRoutes()
        if (routesResult.success) {
          setRoutes(routesResult.routes || [])
        } else {
          console.error("Failed to fetch routes:", routesResult.message)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("An error occurred while fetching mountains and routes")
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()
  }, [])

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Validate form
    if (!formData.mountainId || !formData.routeId) {
      setError("Please select both a mountain and a route")
      setIsSubmitting(false)
      return
    }

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
              Tambah Rute Gunung
            </li>
          </ol>
        </nav>
      </div>

      <div className="px-4 pb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Tambah Rute Gunung Baru</h2>
          <Link to="/dashboard/mountain-routes" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-2"></i>Kembali ke Daftar Rute Gunung
          </Link>
        </div>

        {showSuccess ? (
          <div className="card shadow-sm">
            <div className="card-body text-center py-5">
              <div className="mb-4">
                <i className="bi bi-check-circle-fill text-success display-1"></i>
              </div>
              <h3 className="mb-2">Rute Gunung Berhasil Dibuat!</h3>
              <p className="text-muted mb-4">Rute telah berhasil ditambahkan ke gunung.</p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/dashboard/mountain-routes" className="btn btn-primary">
                  Kembali ke Daftar Rute Gunung
                </Link>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    setShowSuccess(false)
                    // Reset form
                    setFormData({
                      mountainId: "",
                      routeId: "",
                    })
                  }}
                >
                  Tambah Rute Gunung Lain
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

              {isLoadingData ? (
                <div className="text-center py-5">
                  <Loading />
                  <p className="mt-3">Memuat data...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-lg-6 mx-auto">
                      <div className="card mb-4">
                        <div className="card-header bg-light">
                          <h5 className="mb-0">Informasi Rute Gunung</h5>
                        </div>
                        <div className="card-body">
                          <div className="mb-4">
                            <label htmlFor="mountainId" className="form-label">
                              Pilih Gunung <span className="text-danger">*</span>
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
                                <option value="">-- Pilih Gunung --</option>
                                {mountains.map((mountain) => (
                                  <option key={mountain.id} value={mountain.id}>
                                    {mountain.name} - {mountain.location}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <div className="alert alert-warning">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                Tidak ada gunung yang tersedia.{" "}
                                <Link to="/dashboard/mountains/create">Tambah gunung baru</Link>
                              </div>
                            )}
                          </div>

                          <div className="mb-4">
                            <label htmlFor="routeId" className="form-label">
                              Pilih Rute <span className="text-danger">*</span>
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
                                <option value="">-- Pilih Rute --</option>
                                {routes.map((route) => (
                                  <option key={route.id} value={route.id}>
                                    {route.routeName}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <div className="alert alert-warning">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                Tidak ada rute yang tersedia.{" "}
                                <Link to="/dashboard/routes/create">Tambah rute baru</Link>
                              </div>
                            )}
                          </div>

                          <div className="alert alert-info">
                            <i className="bi bi-info-circle me-2"></i>
                            Menghubungkan gunung dengan rute akan memungkinkan pendaki untuk memilih rute saat mendaki
                            gunung tersebut.
                          </div>
                        </div>
                      </div>

                      <div className="d-flex justify-content-end gap-2 mt-4">
                        <Link to="/dashboard/mountain-routes" className="btn btn-secondary">
                          Batal
                        </Link>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Membuat...
                            </>
                          ) : (
                            "Buat Rute Gunung"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateMountainRoute