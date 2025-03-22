"use client"

import { useState, useEffect } from "react"
import Loading from "../components/loading/Loading"
import { getAllMountains, createMountain, updateMountain, deleteMountain } from "../api/mountains"

const MountainsTable = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMountain, setSelectedMountain] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [mountainToDelete, setMountainToDelete] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mountains, setMountains] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalElements: 0,
  })

  const [newMountain, setNewMountain] = useState({
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

  const [editMountain, setEditMountain] = useState({
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
  })

  // State for file uploads
  const [mountainImage, setMountainImage] = useState(null)
  const [basecampImages, setBasecampImages] = useState([])
  const [editMountainImage, setEditMountainImage] = useState(null)
  const [editBasecampImages, setEditBasecampImages] = useState([])
  const [previewMountainImage, setPreviewMountainImage] = useState(null)
  const [previewBasecampImages, setPreviewBasecampImages] = useState([])

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
        setMountains(result.mountains)
        setPagination(result.pagination)
      } else {
        console.error("Failed to fetch mountains:", result.message)
      }
    } catch (error) {
      console.error("Error fetching mountains:", error)
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
    setSelectedMountain(mountain)
    setShowDetailModal(true)
  }

  // Close detail modal
  const handleCloseDetailModal = () => {
    setShowDetailModal(false)
    setSelectedMountain(null)
  }

  // Handle add mountain
  const handleAddMountain = () => {
    setShowAddModal(true)
  }

  // Handle mountain image upload
  const handleMountainImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setMountainImage(file)
      setPreviewMountainImage(URL.createObjectURL(file))
    }
  }

  // Handle basecamp images upload
  const handleBasecampImagesChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setBasecampImages(files)
      const previews = files.map((file) => URL.createObjectURL(file))
      setPreviewBasecampImages(previews)
    }
  }

  // Handle edit mountain image upload
  const handleEditMountainImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setEditMountainImage(file)
      setPreviewMountainImage(URL.createObjectURL(file))
    }
  }

  // Handle edit basecamp images upload
  const handleEditBasecampImagesChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setEditBasecampImages(files)
      const previews = files.map((file) => URL.createObjectURL(file))
      setPreviewBasecampImages(previews)
    }
  }

  // Close add modal with cleanup
  const handleCloseAddModal = () => {
    setShowAddModal(false)
    setNewMountain({
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
    setMountainImage(null)
    setBasecampImages([])
    setPreviewMountainImage(null)
    setPreviewBasecampImages([])
  }

  // Close edit modal with cleanup
  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setEditMountain({
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
    })
    setEditMountainImage(null)
    setEditBasecampImages([])
    setPreviewMountainImage(null)
    setPreviewBasecampImages([])
  }

  // Handle input change for new mountain
  const handleNewMountainChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name.startsWith("ranger_")) {
      const rangerField = name.replace("ranger_", "")
      setNewMountain((prev) => ({
        ...prev,
        assigned_ranger: {
          ...prev.assigned_ranger,
          [rangerField]: value,
        },
      }))
    } else {
      setNewMountain((prev) => ({
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : name === "price" || name === "quotaLimit"
              ? Number(value)
              : name === "isOpen" || name === "toilet"
                ? String(value) === "true"
                : value,
      }))
    }
  }

  // Save new mountain
  const handleSaveMountain = async () => {
    setIsLoading(true)
    try {
      const result = await createMountain(newMountain, mountainImage, basecampImages)
      if (result.success) {
        setSuccessMessage("Mountain created successfully!")
        setShowSuccessModal(true)
        handleCloseAddModal()
        fetchMountains() // Refresh the list
      } else {
        alert(result.message || "Failed to create mountain")
      }
    } catch (error) {
      console.error("Error creating mountain:", error)
      alert("An error occurred while creating the mountain")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle edit mountain
  const handleEditMountain = (mountain) => {
    setSelectedMountain(mountain)
    // Convert boolean values to strings for form inputs
    setEditMountain({
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
    })
    setShowEditModal(true)

    // Reset image previews
    setPreviewMountainImage(null)
    setPreviewBasecampImages([])
  }

  // Handle input change for edit mountain
  const handleEditMountainChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditMountain((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "price" || name === "quotaLimit"
            ? Number(value)
            : name === "isOpen" || name === "toilet"
              ? String(value) === "true"
              : value,
    }))
  }

  // Update mountain
  const handleUpdateMountain = async () => {
    setIsLoading(true)
    try {
      const result = await updateMountain(editMountain, editMountainImage, editBasecampImages)
      if (result.success) {
        setSuccessMessage("Mountain updated successfully!")
        setShowSuccessModal(true)
        handleCloseEditModal()
        fetchMountains() // Refresh the list
      } else {
        alert(result.message || "Failed to update mountain")
      }
    } catch (error) {
      console.error("Error updating mountain:", error)
      alert("An error occurred while updating the mountain")
    } finally {
      setIsLoading(false)
    }
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
    setIsLoading(true)
    try {
      const result = await deleteMountain(mountainToDelete.id)
      if (result.success) {
        setSuccessMessage("Mountain deleted successfully!")
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
      setIsLoading(false)
    }
  }

  // Close success modal
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
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
      <h2 className="text-center mb-3">Mountains Management</h2>

      {/* Search Bar and Add Button */}
      <div className="row mb-3">
        <div className="col-md-8">
          <form onSubmit={handleSearch} className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button type="submit" className="btn btn-primary">
              <i className="bi bi-search"></i> Search
            </button>
          </form>
        </div>
        <div className="col-md-4 d-flex justify-content-end">
          <button className="btn btn-success" onClick={handleAddMountain}>
            <i className="bi bi-plus-circle"></i> Add Mountain
          </button>
        </div>
      </div>

      {/* Status Filter */}
      <div className="mb-3">
        <select className="form-select w-auto" value={statusFilter} onChange={handleStatusFilterChange}>
          <option value="">All Statuses</option>
          <option value="SAFE">Safe</option>
          <option value="OPEN">Open</option>
          <option value="WARNING">Warning</option>
          <option value="DANGEROUS">Dangerous</option>
          <option value="CLOSED">Closed</option>
        </select>
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
                <th>ID</th>
                <th>Name</th>
                <th>Location</th>
                <th>Status</th>
                <th>Price</th>
                <th>Open</th>
                <th>Quota</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMountains.length > 0 ? (
                filteredMountains.map((mountain) => (
                  <tr key={mountain.id}>
                    <td>{mountain.id.substring(0, 8)}...</td>
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
                    <td>
                      <span className={`badge ${mountain.isOpen ? "bg-success" : "bg-danger"}`}>
                        {mountain.isOpen ? "Open" : "Closed"}
                      </span>
                    </td>
                    <td>{mountain.quotaLimit}</td>
                    <td>
                      
                      <button
                        className="btn btn-warning btn-sm me-1"
                        onClick={() => handleEditMountain(mountain)}
                        title="Edit"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-danger btn-sm me-1"
                        onClick={() => handleDeleteMountain(mountain)}
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                      <button
                        className="btn btn-info btn-sm "
                        onClick={() => handleViewDetail(mountain)}
                        title="View Details"
                      >
                        <i className="bi bi-eye"></i>
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
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${pagination.page === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                &lt;
              </button>
            </li>
            {[...Array(pagination.totalPages)].map((_, index) => (
              <li key={index} className={`page-item ${pagination.page === index + 1 ? "active" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${pagination.page === pagination.totalPages ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                &gt;
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedMountain && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Mountain Details</h5>
                <button type="button" className="btn-close" onClick={handleCloseDetailModal}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    {selectedMountain.mountainCoverUrl ? (
                      <img
                        src={selectedMountain.mountainCoverUrl || "/placeholder.svg"}
                        alt={selectedMountain.name}
                        className="img-fluid rounded mb-3"
                      />
                    ) : (
                      <div className="bg-light text-center p-5 mb-3 rounded">
                        <i className="bi bi-image text-muted display-4"></i>
                        <p className="mt-2">No image available</p>
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <h4>{selectedMountain.name}</h4>
                    <p>
                      <strong>ID:</strong> {selectedMountain.id}
                    </p>
                    <p>
                      <strong>Location:</strong> {selectedMountain.location}
                    </p>
                    <p>
                      <strong>Status:</strong>
                      <span
                        className={`badge ms-2 bg-${
                          selectedMountain.status === "SAFE"
                            ? "success"
                            : selectedMountain.status === "OPEN"
                              ? "success"
                              : selectedMountain.status === "WARNING"
                                ? "warning"
                                : selectedMountain.status === "DANGEROUS"
                                  ? "danger"
                                  : "secondary"
                        }`}
                      >
                        {selectedMountain.status}
                      </span>
                    </p>
                    <p>
                      <strong>Price:</strong> {formatPrice(selectedMountain.price)}
                    </p>
                    <p>
                      <strong>Open:</strong>
                      <span className={`badge ms-2 ${selectedMountain.isOpen ? "bg-success" : "bg-danger"}`}>
                        {selectedMountain.isOpen ? "Yes" : "No"}
                      </span>
                    </p>
                    <p>
                      <strong>Quota Limit:</strong> {selectedMountain.quotaLimit}
                    </p>
                    <p>
                      <strong>Toilet Available:</strong> {selectedMountain.toilet ? "Yes" : "No"}
                    </p>
                    <p>
                      <strong>Water:</strong> {selectedMountain.water || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <h5>Description</h5>
                  <p>{selectedMountain.description || "No description available."}</p>
                </div>

                {selectedMountain.rangerResponse && (
                  <div className="mt-3">
                    <h5>Assigned Ranger</h5>
                    <div className="card">
                      <div className="card-body">
                        <p>
                          <strong>Name:</strong> {selectedMountain.rangerResponse.name}
                        </p>
                        <p>
                          <strong>Phone:</strong> {selectedMountain.rangerResponse.phoneNumber}
                        </p>
                        <p>
                          <strong>Email:</strong> {selectedMountain.rangerResponse.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseDetailModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Mountain Modal */}
      {showAddModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Mountain</h5>
                <button type="button" className="btn-close" onClick={handleCloseAddModal}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={newMountain.name}
                        onChange={handleNewMountainChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        name="location"
                        value={newMountain.location}
                        onChange={handleNewMountainChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        name="status"
                        value={newMountain.status}
                        onChange={handleNewMountainChange}
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
                      <label className="form-label">Price (IDR)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={newMountain.price}
                        onChange={handleNewMountainChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Quota Limit</label>
                      <input
                        type="number"
                        className="form-control"
                        name="quotaLimit"
                        value={newMountain.quotaLimit}
                        onChange={handleNewMountainChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Is Open</label>
                      <select
                        className="form-select"
                        name="isOpen"
                        value={String(newMountain.isOpen)}
                        onChange={handleNewMountainChange}
                        required
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Toilet Available</label>
                      <select
                        className="form-select"
                        name="toilet"
                        value={String(newMountain.toilet)}
                        onChange={handleNewMountainChange}
                        required
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Water Availability</label>
                    <input
                      type="text"
                      className="form-control"
                      name="water"
                      value={newMountain.water}
                      onChange={handleNewMountainChange}
                      placeholder="e.g., Available at basecamp"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={newMountain.description}
                      onChange={handleNewMountainChange}
                      rows="3"
                    ></textarea>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Mountain Cover Image</label>
                    <input type="file" className="form-control" accept="image/*" onChange={handleMountainImageChange} />
                    {previewMountainImage && (
                      <div className="mt-2">
                        <img
                          src={previewMountainImage || "/placeholder.svg"}
                          alt="Mountain preview"
                          className="img-thumbnail"
                          style={{ maxHeight: "200px" }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Basecamp Images (Multiple)</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      multiple
                      onChange={handleBasecampImagesChange}
                    />
                    {previewBasecampImages.length > 0 && (
                      <div className="mt-2 d-flex flex-wrap gap-2">
                        {previewBasecampImages.map((preview, index) => (
                          <img
                            key={index}
                            src={preview || "/placeholder.svg"}
                            alt={`Basecamp preview ${index + 1}`}
                            className="img-thumbnail"
                            style={{ height: "100px", width: "100px", objectFit: "cover" }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <h5 className="mt-4">Assigned Ranger</h5>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Ranger Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="ranger_name"
                        value={newMountain.assigned_ranger.name}
                        onChange={handleNewMountainChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        name="ranger_phone_number"
                        value={newMountain.assigned_ranger.phone_number}
                        onChange={handleNewMountainChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        type="text"
                        className="form-control"
                        name="ranger_email"
                        value={newMountain.assigned_ranger.email}
                        onChange={handleNewMountainChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="ranger_password"
                        value={newMountain.assigned_ranger.password}
                        onChange={handleNewMountainChange}
                        required
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseAddModal}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSaveMountain} disabled={isLoading}>
                  {isLoading ? <Loading /> : "Save Mountain"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Mountain Modal */}
      {showEditModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Mountain</h5>
                <button type="button" className="btn-close" onClick={handleCloseEditModal}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={editMountain.name}
                        onChange={handleEditMountainChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        name="location"
                        value={editMountain.location}
                        onChange={handleEditMountainChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        name="status"
                        value={editMountain.status}
                        onChange={handleEditMountainChange}
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
                      <label className="form-label">Price (IDR)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={editMountain.price}
                        onChange={handleEditMountainChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Quota Limit</label>
                      <input
                        type="number"
                        className="form-control"
                        name="quotaLimit"
                        value={editMountain.quotaLimit}
                        onChange={handleEditMountainChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Is Open</label>
                      <select
                        className="form-select"
                        name="isOpen"
                        value={String(editMountain.isOpen)}
                        onChange={handleEditMountainChange}
                        required
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Toilet Available</label>
                      <select
                        className="form-select"
                        name="toilet"
                        value={String(editMountain.toilet)}
                        onChange={handleEditMountainChange}
                        required
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Water Availability</label>
                    <input
                      type="text"
                      className="form-control"
                      name="water"
                      value={editMountain.water}
                      onChange={handleEditMountainChange}
                      placeholder="e.g., Available at basecamp"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={editMountain.description}
                      onChange={handleEditMountainChange}
                      rows="3"
                    ></textarea>
                  </div>

                  {/* Edit Mountain Modal - File Upload Fields */}
                  <div className="mb-4">
                    <label className="form-label">Mountain Cover Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleEditMountainImageChange}
                    />
                    {previewMountainImage ? (
                      <div className="mt-2">
                        <img
                          src={previewMountainImage || "/placeholder.svg"}
                          alt="Mountain preview"
                          className="img-thumbnail"
                          style={{ maxHeight: "200px" }}
                        />
                      </div>
                    ) : (
                      selectedMountain?.mountainCoverUrl && (
                        <div className="mt-2">
                          <img
                            src={selectedMountain.mountainCoverUrl || "/placeholder.svg"}
                            alt="Current mountain image"
                            className="img-thumbnail"
                            style={{ maxHeight: "200px" }}
                          />
                          <p className="text-muted small">Current image</p>
                        </div>
                      )
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Basecamp Images (Multiple)</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      multiple
                      onChange={handleEditBasecampImagesChange}
                    />
                    {previewBasecampImages.length > 0 ? (
                      <div className="mt-2 d-flex flex-wrap gap-2">
                        {previewBasecampImages.map((preview, index) => (
                          <img
                            key={index}
                            src={preview || "/placeholder.svg"}
                            alt={`Basecamp preview ${index + 1}`}
                            className="img-thumbnail"
                            style={{ height: "100px", width: "100px", objectFit: "cover" }}
                          />
                        ))}
                      </div>
                    ) : (
                      selectedMountain?.baseCampImagesUrl?.length > 0 && (
                        <div className="mt-2">
                          <p className="text-muted small">Current basecamp images:</p>
                          <div className="d-flex flex-wrap gap-2">
                            {selectedMountain.baseCampImagesUrl.map((url, index) => (
                              <img
                                key={index}
                                src={url || "/placeholder.svg"}
                                alt={`Current basecamp image ${index + 1}`}
                                className="img-thumbnail"
                                style={{ height: "100px", width: "100px", objectFit: "cover" }}
                              />
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseEditModal}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateMountain} disabled={isLoading}>
                  {isLoading ? <Loading /> : "Update Mountain"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && mountainToDelete && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={handleCloseDeleteModal}></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete <strong>{mountainToDelete.name}</strong>?
                </p>
                <p className="text-danger">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseDeleteModal}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={confirmDeleteMountain} disabled={isLoading}>
                  {isLoading ? <Loading /> : "Delete"}
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
                <button type="button" className="btn-close" onClick={handleCloseSuccessModal}></button>
              </div>
              <div className="modal-body">
                <div className="text-center">
                  <i className="bi bi-check-circle text-success" style={{ fontSize: "3rem" }}></i>
                  <p className="mt-3">{successMessage}</p>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={handleCloseSuccessModal}>
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

