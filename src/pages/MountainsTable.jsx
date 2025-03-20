import React, { useState } from "react";
import Loading from "../components/loading/Loading";

const MountainsTable = ({ data, itemsPerPage }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMountain, setSelectedMountain] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [mountainToDelete, setMountainToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newMountain, setNewMountain] = useState({
    name: "",
    location: "",
    elevation: "",
    difficulty: "",
    price: "",
    description: "",
  });
  const [editMountain, setEditMountain] = useState({
    id: "",
    name: "",
    location: "",
    elevation: "",
    difficulty: "",
    price: "",
    description: "",
    image: "", // Tambahkan field image
    created_at: "", // Tambahkan field created_at
  }); // State untuk form edit data

  // Filter data berdasarkan searchQuery
  const filteredData = data.mountains.filter((mountain) => mountain.name.toLowerCase().includes(searchQuery.toLowerCase()) || mountain.location.toLowerCase().includes(searchQuery.toLowerCase()));

  // Paginate data yang sudah difilter
  const paginateData = (items, currentPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  // Hitung total halaman berdasarkan data yang sudah difilter
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Fungsi untuk menampilkan detail mountain
  const handleViewDetail = (mountain) => {
    setSelectedMountain(mountain);
    setShowDetailModal(true);
  };

  // Fungsi untuk menutup modal detail
  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedMountain(null);
  };

  // Fungsi untuk membuka modal tambah data
  const handleAddMountain = () => {
    setShowAddModal(true);
  };

  // Fungsi untuk menutup modal tambah data
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewMountain({
      name: "",
      location: "",
      elevation: "",
      difficulty: "",
      price: "",
      description: "",
    });
  };

  // Fungsi untuk menangani perubahan input form tambah data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMountain((prev) => ({ ...prev, [name]: value }));
  };

  const generateId = (data) => {
    let newId;
    do {
      newId = Date.now(); // Generate ID berbasis timestamp
    } while (data.mountains.some((mountain) => mountain.id === newId)); // Pastikan ID unik
    return newId;
  };

  // Fungsi untuk menyimpan data baru
  const handleSaveMountain = async () => {
    setIsLoading(ture);
    try {
      const newId = generateId(data); // Generate ID unik
      const response = await fetch("http://localhost:5000/mountains", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newMountain,
          id: newId, // Gunakan ID baru
          image: "https://via.placeholder.com/150", // Default image
          elevation: Number(newMountain.elevation) || 0, // Pastikan elevation tidak kosong
          price: Number(newMountain.price), // Konversi price ke number
          difficulty: newMountain.difficulty.charAt(0).toUpperCase() + newMountain.difficulty.slice(1), // Format difficulty
          created_at: new Date().toISOString(), // Format created_at
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Data saved successfully:", data);
        setShowSuccessModal(true);
        handleCloseAddModal();
      } else {
        const errorData = await response.text();
        console.error("Failed to save data:", errorData);
        alert("Failed to save data.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred while saving data.");
    } finally {
      setIsLoading(false);
    }
  };
  // Fungsi untuk menutup modal alert sukses
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    // Di sini Anda bisa menambahkan logika untuk memperbarui data tabel
  };

  // Fungsi untuk membuka modal edit data
  const handleEditMountain = (mountain) => {
    setEditMountain(mountain); // Set data yang akan diedit
    setShowEditModal(true);
  };

  // Fungsi untuk menutup modal edit data
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditMountain({
      id: "",
      name: "",
      location: "",
      elevation: "",
      difficulty: "",
      price: "",
      description: "",
    });
  };

  // Fungsi untuk menangani perubahan input form edit data
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditMountain((prev) => ({ ...prev, [name]: value }));
  };

  // Fungsi untuk menyimpan data yang diupdate
  const handleUpdateMountain = async () => {
    setIsLoading(true);
    try {
      const updatedMountain = {
        ...editMountain,
        price: Number(editMountain.price), // Konversi price ke number
        elevation: Number(editMountain.elevation) || 0, // Pastikan elevation tidak kosong
        image: editMountain.image || "https://via.placeholder.com/150", // Default image jika kosong
        created_at: editMountain.created_at || new Date().toISOString(), // Default created_at jika kosong
      };

      const response = await fetch(`http://localhost:5000/mountains/${editMountain.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMountain),
      });

      if (response.ok) {
        setShowSuccessModal(true);
        handleCloseEditModal();
      } else {
        const errorData = await response.text();
        console.error("Failed to update data:", errorData);
        alert("Failed to update data.");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      alert("An error occurred while updating data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk membuka modal hapus data
  const handleDeleteMountain = (mountain) => {
    setMountainToDelete(mountain);
    setShowDeleteModal(true);
  };

  // Fungsi untuk menutup modal hapus data
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setMountainToDelete(null);
  };

  // Fungsi untuk mengonfirmasi penghapusan data
  const confirmDeleteMountain = async () => {
    setIsLoading(true);
    if (mountainToDelete) {
      try {
        const response = await fetch(`http://localhost:5000/mountains/${mountainToDelete.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setShowSuccessModal(true);
          handleCloseDeleteModal();
        } else {
          const errorData = await response.text();
          console.error("Failed to delete data:", errorData);
          alert("Failed to delete data.");
        }
      } catch (error) {
        console.error("Error deleting data:", error);
        alert("An error occurred while deleting data.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">Mountains</h2>

      {/* Search Bar dan Tombol Add */}
      <div className="mb-3">
        <button className="btn btn-primary mb-2" onClick={handleAddMountain}>
          <i className="bi bi-plus"></i> Add Data
        </button>
        <input
          type="text"
          className="form-control"
          placeholder="Search by name or location..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset ke halaman 1 saat melakukan pencarian
          }}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Location</th>
              <th>Elevation</th>
              <th>Difficulty</th>
              <th>Price</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginateData(filteredData, currentPage).map((mountain) => (
              <tr key={mountain.id}>
                <td>{mountain.id}</td>
                <td>{mountain.name}</td>
                <td>{mountain.location}</td>
                <td>{mountain.elevation} meters</td>
                <td>{mountain.difficulty}</td>
                <td>${mountain.price}</td>
                <td>{new Date(mountain.created_at).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditMountain(mountain)}>
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button className="btn btn-danger btn-sm me-2" onClick={() => handleDeleteMountain(mountain)}>
                    <i className="bi bi-trash"></i>
                  </button>
                  <button className="btn btn-info btn-sm" onClick={() => handleViewDetail(mountain)}>
                    <i className="bi bi-eye"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} className="page-link" disabled={currentPage === 1}>
              &lt;
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
              <button onClick={() => setCurrentPage(index + 1)} className="page-link">
                {index + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} className="page-link" disabled={currentPage === totalPages}>
              &gt;
            </button>
          </li>
        </ul>
      </nav>

      {/* Modal Detail */}
      {showDetailModal && selectedMountain && (
        <div className="modal" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Mountain Detail</h5>
                <button type="button" className="btn-close" onClick={handleCloseDetailModal}></button>
              </div>
              <div className="modal-body">
                <img src={selectedMountain.image} alt={selectedMountain.name} className="img-fluid mb-3" style={{ borderRadius: "10px" }} />
                <p>
                  <strong>ID:</strong> {selectedMountain.id}
                </p>
                <p>
                  <strong>Name:</strong> {selectedMountain.name}
                </p>
                <p>
                  <strong>Location:</strong> {selectedMountain.location}
                </p>
                <p>
                  <strong>Elevation:</strong> {selectedMountain.elevation} meters
                </p>
                <p>
                  <strong>Difficulty:</strong> {selectedMountain.difficulty}
                </p>
                <p>
                  <strong>Price:</strong> ${selectedMountain.price}
                </p>
                <p>
                  <strong>Created At:</strong> {new Date(selectedMountain.created_at).toLocaleDateString()}
                </p>
                <p>
                  <strong>Description:</strong> {selectedMountain.description}
                </p>
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

      {/* Modal Tambah Data */}
      {showAddModal && (
        <div className="modal" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Mountain</h5>
                <button type="button" className="btn-close" onClick={handleCloseAddModal}></button>
              </div>
              <div className="modal-body">
                <div className="card">
                  <div className="card-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control" name="name" value={newMountain.name} onChange={handleInputChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Location</label>
                        <input type="text" className="form-control" name="location" value={newMountain.location} onChange={handleInputChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Elevation</label>
                        <input type="number" className="form-control" name="elevation" value={newMountain.elevation} onChange={handleInputChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Difficulty</label>
                        <input type="text" className="form-control" name="difficulty" value={newMountain.difficulty} onChange={handleInputChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Price</label>
                        <input type="number" className="form-control" name="price" value={newMountain.price} onChange={handleInputChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea className="form-control" rows="3" name="description" value={newMountain.description} onChange={handleInputChange}></textarea>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseAddModal}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSaveMountain} disabled={isLoading}>
                  {isLoading ? <Loading /> : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Data */}
      {showEditModal && (
        <div className="modal" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Mountain</h5>
                <button type="button" className="btn-close" onClick={handleCloseEditModal}></button>
              </div>
              <div className="modal-body">
                <div className="card">
                  <div className="card-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control" name="name" value={editMountain.name} onChange={handleEditInputChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Location</label>
                        <input type="text" className="form-control" name="location" value={editMountain.location} onChange={handleEditInputChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Elevation</label>
                        <input type="number" className="form-control" name="elevation" value={editMountain.elevation} onChange={handleEditInputChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Difficulty</label>
                        <input type="text" className="form-control" name="difficulty" value={editMountain.difficulty} onChange={handleEditInputChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Price</label>
                        <input type="number" className="form-control" name="price" value={editMountain.price} onChange={handleEditInputChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea className="form-control" rows="3" name="description" value={editMountain.description} onChange={handleEditInputChange}></textarea>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseEditModal}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateMountain} disabled={isLoading}>
                  {isLoading ? <Loading /> : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Hapus Data */}
      {showDeleteModal && mountainToDelete && (
        <div className="modal" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Mountain</h5>
                <button type="button" className="btn-close" onClick={handleCloseDeleteModal}></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete <strong>{mountainToDelete.name}</strong>?
                </p>
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

      {/* Modal Alert Sukses */}
      {showSuccessModal && (
        <div className="modal" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Success</h5>
                <button type="button" className="btn-close" onClick={handleCloseSuccessModal}></button>
              </div>
              <div className="modal-body">
                <p>Data berhasil tersimpan!</p>
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
  );
};

export default MountainsTable;
