"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createRoute } from "../../api/routes"
import { Link } from "react-router-dom"

const CreateRoute = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState(null)

  // Form data state
  const [formData, setFormData] = useState({
    routeName: "",
    description: "",
    difficulty: "MEDIUM",
    estimatedTime: "",
    checkpoints: [],
  })

  // Checkpoint state
  const [checkpoint, setCheckpoint] = useState("")

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle checkpoint input change
  const handleCheckpointChange = (e) => {
    setCheckpoint(e.target.value)
  }

  // Add checkpoint to the list
  const handleAddCheckpoint = () => {
    if (checkpoint.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        checkpoints: [...prev.checkpoints, checkpoint.trim()],
      }))
      setCheckpoint("")
    }
  }

  // Remove checkpoint from the list
  const handleRemoveCheckpoint = (index) => {
    setFormData((prev) => ({
      ...prev,
      checkpoints: prev.checkpoints.filter((_, i) => i !== index),
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await createRoute(formData)

      if (result.success) {
        setShowSuccess(true)
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate("/dashboard/routes")
        }, 2000)
      } else {
        setError(result.message || "Failed to create route")
      }
    } catch (error) {
      console.error("Error creating route:", error)
      setError("An error occurred while creating the route")
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
              <Link to="/dashboard/routes">Rute</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Buat Rute
            </li>
          </ol>
        </nav>
      </div>

      <div className="px-4 pb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Buat Rute Baru</h2>
          <Link to="/dashboard/routes" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-2"></i>Kembali Ke Rute
          </Link>
        </div>

        {showSuccess ? (
          <div className="card shadow-sm">
            <div className="card-body text-center py-5">
              <div className="mb-4">
                <i className="bi bi-check-circle-fill text-success display-1"></i>
              </div>
              <h3 className="mb-2">Berhasil Membuat Rute!.</h3>
              <p className="text-muted mb-4">Rute Baru Sudah Ditambahkan Di Database.</p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/dashboard/routes" className="btn btn-primary">
                  Kembali ke Daftar Rute
                </Link>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    setShowSuccess(false)
                    // Reset form
                    setFormData({
                      routeName: "",
                      description: "",
                      difficulty: "MEDIUM",
                      estimatedTime: "",
                      checkpoints: [],
                    })
                  }}
                >
                  Buat Rute Lain
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
                  <div className="col-lg-8">
                    {/* Basic Information */}
                    <div className="card mb-4">
                      <div className="card-header bg-light">
                        <h5 className="mb-0">Informasi Rute</h5>
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-md-12">
                            <label htmlFor="routeName" className="form-label">
                              Nama Rute <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="routeName"
                              name="routeName"
                              value={formData.routeName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="difficulty" className="form-label">
                              Tingkat Kesulitan <span className="text-danger">*</span>
                            </label>
                            <select
                              className="form-select"
                              id="difficulty"
                              name="difficulty"
                              value={formData.difficulty}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="EASY">Easy</option>
                              <option value="MEDIUM">Medium</option>
                              <option value="HARD">Hard</option>
                            </select>
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="estimatedTime" className="form-label">
                              Waktu Perkiraan<span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="estimatedTime"
                              name="estimatedTime"
                              value={formData.estimatedTime}
                              onChange={handleInputChange}
                              placeholder="e.g., 3-4 hours"
                              required
                            />
                          </div>
                          <div className="col-12">
                            <label htmlFor="description" className="form-label">
                              Deskripsi <span className="text-danger">*</span>
                            </label>
                            <textarea
                              className="form-control"
                              id="description"
                              name="description"
                              rows="4"
                              value={formData.description}
                              onChange={handleInputChange}
                              required
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4">
                    {/* Checkpoints */}
                    <div className="card mb-4">
                      <div className="card-header bg-light">
                        <h5 className="mb-0">Pos Pemeriksaan</h5>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <label htmlFor="checkpoint" className="form-label">
                            Tambah Pos Pemeriksaan
                          </label>
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              id="checkpoint"
                              value={checkpoint}
                              onChange={handleCheckpointChange}
                              placeholder="e.g., Basecamp, Pos 1, Summit"
                            />
                            <button type="button" className="btn btn-outline-primary" onClick={handleAddCheckpoint}>
                              <i className="bi bi-plus-lg"></i>
                            </button>
                          </div>
                          <small className="text-muted">Tambah Pos Pemeriksaan Sepanjang Rute</small>
                        </div>

                        {formData.checkpoints.length > 0 ? (
                          <div className="list-group mt-3">
                            {formData.checkpoints.map((cp, index) => (
                              <div
                                key={index}
                                className="list-group-item d-flex justify-content-between align-items-center"
                              >
                                <div>
                                  <span className="badge bg-primary rounded-pill me-2">{index + 1}</span>
                                  {cp}
                                </div>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleRemoveCheckpoint(index)}
                                >
                                  <i className="bi bi-x-lg"></i>
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="alert alert-info mb-0">
                            <i className="bi bi-info-circle me-2"></i>
                            Belum Ada Pos Pemeriksaan yang Ditambah.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Link to="/dashboard/routes" className="btn btn-secondary">
                    Batal
                  </Link>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Membuat...
                      </>
                    ) : (
                      "Create Route"
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

export default CreateRoute