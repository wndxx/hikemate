"use client"

import { useState, useEffect } from "react"
import { createMountain } from "../api/mountains"
import { getAllRoutes } from "../api/routes"

const CreateMountainModal = ({ onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [routes, setRoutes] = useState([])
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false)

  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    status: "SAFE",
    price: 0,
    isOpen: true,
    description: "",
    toilet: true,
    quotaLimit: 10,
    water: "",
    assigned_ranger: {
      name: "",
      phone_number: "",
      email: "",
      password: "",
    },
  })

  // File upload states
  const [mountainCoverImage, setMountainCoverImage] = useState(null)
  const [basecampImages, setBasecampImages] = useState([])
  const [previewCover, setPreviewCover] = useState(null)
  const [previewBasecamp, setPreviewBasecamp] = useState([])

  // Fetch routes on component mount
  useEffect(() => {
    const fetchRoutes = async () => {
      setIsLoadingRoutes(true)
      try {
        const result = await getAllRoutes()
        if (result.success) {
          setRoutes(result.routes || [])
          console.log("Fetched routes:", result.routes)
        } else {
          console.error("Failed to fetch routes:", result.message)
        }
      } catch (error) {
        console.error("Error fetching routes:", error)
      } finally {
        setIsLoadingRoutes(false)
      }
    }

    fetchRoutes()
  }, [])

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name.startsWith("ranger_")) {
      const rangerField = name.replace("ranger_", "")
      setFormData((prev) => ({
        ...prev,
        assigned_ranger: {
          ...prev.assigned_ranger,
          [rangerField]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : name === "price" || name === "quotaLimit" ? Number(value) : value,
      }))
    }
  }

  // Handle mountain cover image upload
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setMountainCoverImage(file)
      setPreviewCover(URL.createObjectURL(file))
    }
  }

  // Handle basecamp images upload
  const handleBasecampImagesChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setBasecampImages(files)
      const previews = files.map((file) => URL.createObjectURL(file))
      setPreviewBasecamp(previews)
    }
  }

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      status: "SAFE",
      price: 0,
      isOpen: true,
      description: "",
      toilet: true,
      quotaLimit: 10,
      water: "",
      assigned_ranger: {
        name: "",
        phone_number: "",
        email: "",
        password: "",
      },
    })
    setMountainCoverImage(null)
    setBasecampImages([])
    setPreviewCover(null)
    setPreviewBasecamp([])
    setError(null)
    setShowSuccess(false)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Validate ranger phone number
    if (formData.assigned_ranger.phone_number.length > 12) {
      setError("Ranger phone number must not exceed 12 characters")
      setIsSubmitting(false)
      return
    }

    try {
      console.log(" hasil create :", formData)
      // Note: we're no longer passing mountainRoutes in the formData
      const result = await createMountain(formData, mountainCoverImage, basecampImages)

      console.log("RESULT =>>", result)

      if (result.success) {
        setShowSuccess(true)
        // Call success callback after 2 seconds
        setTimeout(() => {
          onSuccess()
          onClose()
        }, 2000)
      } else {
        setError(result.message || "Failed to create mountain")
      }
    } catch (error) {
      console.error("Error creating mountain:", error)
      setError("An error occurred while creating the mountain")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{showSuccess ? "Mountain Created" : "Create New Mountain"}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {showSuccess ? (
              <div className="text-center py-4">
                <div className="mb-4">
                  <i className="bi bi-check-circle-fill text-success display-1"></i>
                </div>
                <h3 className="mb-2">Mountain Created Successfully!</h3>
                <p className="text-muted mb-4">Your new mountain has been added to the database.</p>
                <p className="text-info">
                  Don't forget to add routes to this mountain through the Mountain Routes management page.
                </p>
              </div>
            ) : (
              <div className="container-fluid">
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
                          <h5 className="mb-0">Basic Information</h5>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-md-6">
                              <label htmlFor="name" className="form-label">
                                Mountain Name <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div className="col-md-6">
                              <label htmlFor="location" className="form-label">
                                Location <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div className="col-md-4">
                              <label htmlFor="status" className="form-label">
                                Status <span className="text-danger">*</span>
                              </label>
                              <select
                                className="form-select"
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                required
                              >
                                <option value="SAFE">Safe</option>
                                <option value="OPEN">Open</option>
                                <option value="WARNING">Warning</option>
                                <option value="DANGEROUS">Dangerous</option>
                                <option value="CLOSED">Closed</option>
                              </select>
                            </div>
                            <div className="col-md-4">
                              <label htmlFor="price" className="form-label">
                                Price (IDR) <span className="text-danger">*</span>
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div className="col-md-4">
                              <label htmlFor="quotaLimit" className="form-label">
                                Quota Limit <span className="text-danger">*</span>
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="quotaLimit"
                                name="quotaLimit"
                                value={formData.quotaLimit}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div className="col-md-6">
                              <div className="form-check form-switch mt-4">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="isOpen"
                                  name="isOpen"
                                  checked={formData.isOpen}
                                  onChange={handleInputChange}
                                />
                                <label className="form-check-label" htmlFor="isOpen">
                                  Open for Hiking
                                </label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-check form-switch mt-4">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="toilet"
                                  name="toilet"
                                  checked={formData.toilet}
                                  onChange={handleInputChange}
                                />
                                <label className="form-check-label" htmlFor="toilet">
                                  Toilet Available
                                </label>
                              </div>
                            </div>
                            <div className="col-12">
                              <label htmlFor="water" className="form-label">
                                Water Availability <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="water"
                                name="water"
                                value={formData.water}
                                onChange={handleInputChange}
                                placeholder="e.g., Available at basecamp and pos 2"
                                required
                              />
                            </div>
                            <div className="col-12">
                              <label htmlFor="description" className="form-label">
                                Description <span className="text-danger">*</span>
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

                      {/* Ranger Information */}
                      <div className="card mb-4">
                        <div className="card-header bg-light">
                          <h5 className="mb-0">Ranger Information</h5>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-md-6">
                              <label htmlFor="ranger_name" className="form-label">
                                Ranger Name <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="ranger_name"
                                name="ranger_name"
                                value={formData.assigned_ranger.name}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div className="col-md-6">
                              <label htmlFor="ranger_phone_number" className="form-label">
                                Phone Number <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="ranger_phone_number"
                                name="ranger_phone_number"
                                value={formData.assigned_ranger.phone_number}
                                onChange={handleInputChange}
                                maxLength={12}
                                placeholder="Max 12 characters"
                                required
                              />
                              <small className="text-muted">Phone number must not exceed 12 characters</small>
                            </div>
                            <div className="col-md-6">
                              <label htmlFor="ranger_email" className="form-label">
                                Email <span className="text-danger">*</span>
                              </label>
                              <input
                                type="email"
                                className="form-control"
                                id="ranger_email"
                                name="ranger_email"
                                value={formData.assigned_ranger.email}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div className="col-md-6">
                              <label htmlFor="ranger_password" className="form-label">
                                Password <span className="text-danger">*</span>
                              </label>
                              <input
                                type="password"
                                className="form-control"
                                id="ranger_password"
                                name="ranger_password"
                                value={formData.assigned_ranger.password}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-4">
                      {/* Images Upload */}
                      <div className="card mb-4">
                        <div className="card-header bg-light">
                          <h5 className="mb-0">Mountain Images</h5>
                        </div>
                        <div className="card-body">
                          <div className="mb-4">
                            <label htmlFor="mountainCover" className="form-label">
                              Mountain Cover Image <span className="text-danger">*</span>
                            </label>
                            <input
                              type="file"
                              className="form-control"
                              id="mountainCover"
                              accept="image/*"
                              onChange={handleCoverImageChange}
                              required
                            />
                            {previewCover && (
                              <div className="mt-3">
                                <img
                                  src={previewCover || "/placeholder.svg"}
                                  alt="Mountain Cover Preview"
                                  className="img-thumbnail"
                                  style={{ maxHeight: "150px", width: "100%", objectFit: "cover" }}
                                />
                              </div>
                            )}
                          </div>

                          <div>
                            <label htmlFor="basecampImages" className="form-label">
                              Basecamp Images
                            </label>
                            <input
                              type="file"
                              className="form-control"
                              id="basecampImages"
                              accept="image/*"
                              multiple
                              onChange={handleBasecampImagesChange}
                            />
                            {previewBasecamp.length > 0 && (
                              <div className="mt-3 row g-2">
                                {previewBasecamp.map((preview, index) => (
                                  <div className="col-6" key={index}>
                                    <img
                                      src={preview || "/placeholder.svg"}
                                      alt={`Basecamp Preview ${index + 1}`}
                                      className="img-thumbnail"
                                      style={{ height: "80px", width: "100%", objectFit: "cover" }}
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Creating...
                        </>
                      ) : (
                        "Create Mountain"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateMountainModal