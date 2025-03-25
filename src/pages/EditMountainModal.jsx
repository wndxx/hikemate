"use client"

import { useState, useEffect } from "react"
import { getMountainById, updateMountain } from "../api/mountains"
import { getAllRoutes } from "../api/routes"
import Loading from "../components/loading/Loading"

const EditMountainModal = ({ mountainId, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [routes, setRoutes] = useState([])
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false)

  // Form data state
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    location: "",
    status: "SAFE",
    price: 0,
    isOpen: true,
    description: "",
    toilet: true,
    quotaLimit: 10,
    water: "",
    mountainRoutes: [],
  })

  // File upload states
  const [mountainCoverImage, setMountainCoverImage] = useState(null)
  const [basecampImages, setBasecampImages] = useState([])
  const [previewCover, setPreviewCover] = useState(null)
  const [previewBasecamp, setPreviewBasecamp] = useState([])

  // Fetch mountain data and routes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setIsLoadingRoutes(true)
      try {
        // Fetch mountain data
        const mountainResult = await getMountainById(mountainId)
        if (mountainResult.success) {
          const mountain = mountainResult.mountain
          setFormData({
            id: mountain.id,
            name: mountain.name,
            location: mountain.location,
            status: mountain.status,
            price: mountain.price,
            isOpen: mountain.isOpen,
            description: mountain.description || "",
            toilet: mountain.toilet,
            quotaLimit: mountain.quotaLimit,
            water: mountain.water || "",
            mountainRoutes: mountain.mountainRoutes || [],
          })

          // Set preview images
          if (mountain.mountainCoverUrl) {
            setPreviewCover(mountain.mountainCoverUrl)
          }
          setPreviewCover(mountain.mountainCoverUrl)

          if (mountain.baseCampImagesUrl && mountain.baseCampImagesUrl.length > 0) {
            setPreviewBasecamp(mountain.baseCampImagesUrl)
          }
        } else {
          setError("Failed to fetch mountain data")
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
        setError("An error occurred while fetching data")
      } finally {
        setIsLoading(false)
        setIsLoadingRoutes(false)
      }
    }

    if (mountainId) {
      fetchData()
    }
  }, [mountainId])

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "price" || name === "quotaLimit" ? Number(value) : value,
    }))
  }

  // Handle route selection
  const handleRouteChange = (e, routeId) => {
    const { checked } = e.target

    if (checked) {
      // Add route to mountainRoutes
      setFormData((prev) => ({
        ...prev,
        mountainRoutes: [
          ...prev.mountainRoutes.filter((route) => route.routeId !== routeId && route.id !== routeId),
          { id: routeId },
        ],
      }))
    } else {
      // Remove route from mountainRoutes
      setFormData((prev) => ({
        ...prev,
        mountainRoutes: prev.mountainRoutes.filter((route) => route.routeId !== routeId && route.id !== routeId),
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await updateMountain(formData, mountainCoverImage, basecampImages)

      if (result.success) {
        setShowSuccess(true)
        // Call success callback after 2 seconds
        setTimeout(() => {
          onSuccess()
          onClose()
        }, 2000)
      } else {
        setError(result.message || "Failed to update mountain")
      }
    } catch (error) {
      console.error("Error updating mountain:", error)
      setError("An error occurred while updating the mountain")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {isLoading ? "Loading..." : `Edit Mountain: ${formData.name}`}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <div className="modal-body">
            {isLoading ? (
              <div className="text-center py-4">
                <Loading />
                <p className="mt-3">Loading mountain data...</p>
              </div>
            ) : showSuccess ? (
              <div className="text-center py-4">
                <div className="mb-4">
                  <i className="bi bi-check-circle-fill text-success display-1"></i>
                </div>
                <h3 className="mb-2">Mountain Updated Successfully!</h3>
                <p className="text-muted mb-4">Your changes have been saved.</p>
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
                              Mountain Cover Image
                            </label>
                            {previewCover && (
                              <div className="mb-3">
                                <img
                                  src={previewCover || "/placeholder.svg"}
                                  alt="Current Mountain Cover"
                                  className="img-thumbnail"
                                  style={{ maxHeight: "150px", width: "100%", objectFit: "cover" }}
                                />
                                <p className="text-muted small mt-1">Current cover image</p>
                              </div>
                            )}
                            <input
                              type="file"
                              className="form-control"
                              id="mountainCover"
                              accept="image/*"
                              onChange={handleCoverImageChange}
                            />
                            <small className="text-muted">Leave empty to keep current image</small>
                          </div>

                          <div>
                            <label htmlFor="basecampImages" className="form-label">
                              Basecamp Images
                            </label>
                            {previewBasecamp.length > 0 && (
                              <div className="mb-3 row g-2">
                                {previewBasecamp.map((preview, index) => (
                                  <div className="col-6" key={index}>
                                    <img
                                      src={preview || "/placeholder.svg"}
                                      alt={`Current Basecamp ${index + 1}`}
                                      className="img-thumbnail"
                                      style={{ height: "80px", width: "100%", objectFit: "cover" }}
                                    />
                                  </div>
                                ))}
                                <p className="text-muted small mt-1">Current basecamp images</p>
                              </div>
                            )}
                            <input
                              type="file"
                              className="form-control"
                              id="basecampImages"
                              accept="image/*"
                              multiple
                              onChange={handleBasecampImagesChange}
                            />
                            <small className="text-muted">Leave empty to keep current images</small>
                          </div>
                        </div>
                      </div>

                      {/* Routes */}
                      <div className="card mb-4">
                        <div className="card-header bg-light">
                          <h5 className="mb-0">Mountain Routes</h5>
                        </div>
                        <div className="card-body">
                          {isLoadingRoutes ? (
                            <div className="text-center py-3">
                              <div className="spinner-border spinner-border-sm text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                              <p className="mb-0 mt-2">Loading routes...</p>
                            </div>
                          ) : routes.length > 0 ? (
                            <div>
                              {routes.map((route) => (
                                <div className="form-check mb-2" key={route.id}>
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`route-${route.id}`}
                                    checked={formData.mountainRoutes.some(
                                      (r) => r.routeId === route.id || r.id === route.id,
                                    )}
                                    onChange={(e) => handleRouteChange(e, route.id)}
                                  />
                                  <label className="form-check-label" htmlFor={`route-${route.id}`}>
                                    {route.routeName}
                                  </label>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="alert alert-info mb-0">
                              <i className="bi bi-info-circle me-2"></i>
                              No routes available.
                            </div>
                          )}
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
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Updating...
                        </>
                      ) : (
                        "Update Mountain"
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

export default EditMountainModal