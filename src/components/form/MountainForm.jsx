"use client";

import { useState, useEffect } from "react";
import { createMountain, updateMountain } from "../../api/mountains";
import Loading from "../loading/Loading";

const MountainForm = ({ mountain = null, onSuccess, onCancel }) => {
  const isEditMode = !!mountain;

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
    assigned_ranger: {
      name: "",
      phone_number: "",
      email: "",
      password: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with mountain data if in edit mode
  useEffect(() => {
    if (isEditMode && mountain) {
      setFormData({
        id: mountain.id || "",
        name: mountain.name || "",
        location: mountain.location || "",
        status: mountain.status || "SAFE",
        price: mountain.price || 0,
        isOpen: mountain.isOpen === false ? false : true,
        description: mountain.description || "",
        toilet: mountain.toilet === false ? false : true,
        quotaLimit: mountain.quotaLimit || 10,
        water: mountain.water || "",
        // Don't include ranger info in edit mode as it's not needed
        assigned_ranger: {
          name: "",
          phone_number: "",
          email: "",
          password: "",
        },
      });
    }
  }, [isEditMode, mountain]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes("ranger.")) {
      // Handle ranger fields
      const rangerField = name.split(".")[1];
      setFormData({
        ...formData,
        assigned_ranger: {
          ...formData.assigned_ranger,
          [rangerField]: value,
        },
      });
    } else if (type === "checkbox") {
      // Handle checkbox fields
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else if (name === "price" || name === "quotaLimit") {
      // Handle numeric fields
      setFormData({
        ...formData,
        [name]: Number.parseInt(value, 10) || 0,
      });
    } else {
      // Handle other fields
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate required fields
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.status) newErrors.status = "Status is required";
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
    if (!formData.description) newErrors.description = "Description is required";
    if (formData.quotaLimit <= 0) newErrors.quotaLimit = "Quota limit must be greater than 0";
    if (!formData.water) newErrors.water = "Water availability information is required";

    // Validate ranger fields if creating a new mountain
    if (!isEditMode) {
      if (!formData.assigned_ranger.name) newErrors["ranger.name"] = "Ranger name is required";
      if (!formData.assigned_ranger.phone_number) newErrors["ranger.phone_number"] = "Ranger phone number is required";
      // Add phone number length validation
      else if (formData.assigned_ranger.phone_number.length > 12) newErrors["ranger.phone_number"] = "Phone number must not exceed 12 characters";
      if (!formData.assigned_ranger.email) newErrors["ranger.email"] = "Ranger email is required";
      if (!formData.assigned_ranger.password) newErrors["ranger.password"] = "Ranger password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      let result;

      if (isEditMode) {
        // Update existing mountain
        result = await updateMountain(formData);
      } else {
        // Create new mountain
        result = await createMountain(formData);
      }

      if (result.success) {
        onSuccess(result.mountain, isEditMode ? "update" : "create");
      } else {
        alert(result.message || `Failed to ${isEditMode ? "update" : "create"} mountain`);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} mountain:`, error);
      alert(`An error occurred while ${isEditMode ? "updating" : "creating"} the mountain`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="name" className="form-label">
            Nama Gunung <span className="text-danger">*</span>
          </label>
          <input type="text" className={`form-control ${errors.name ? "is-invalid" : ""}`} id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter mountain name" />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="location" className="form-label">
            Lokasi <span className="text-danger">*</span>
          </label>
          <input type="text" className={`form-control ${errors.location ? "is-invalid" : ""}`} id="location" name="location" value={formData.location} onChange={handleChange} placeholder="Enter location" />
          {errors.location && <div className="invalid-feedback">{errors.location}</div>}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="status" className="form-label">
            Status <span className="text-danger">*</span>
          </label>
          <select className={`form-select ${errors.status ? "is-invalid" : ""}`} id="status" name="status" value={formData.status} onChange={handleChange}>
            <option value="SAFE">Safe</option>
            <option value="OPEN">Open</option>
            <option value="WARNING">Warning</option>
            <option value="DANGEROUS">Dangerous</option>
            <option value="CLOSED">Closed</option>
          </select>
          {errors.status && <div className="invalid-feedback">{errors.status}</div>}
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="price" className="form-label">
            Harga (IDR) <span className="text-danger">*</span>
          </label>
          <input type="number" className={`form-control ${errors.price ? "is-invalid" : ""}`} id="price" name="price" value={formData.price} onChange={handleChange} placeholder="Enter price" min="0" />
          {errors.price && <div className="invalid-feedback">{errors.price}</div>}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="quotaLimit" className="form-label">
            Batas Kuota <span className="text-danger">*</span>
          </label>
          <input type="number" className={`form-control ${errors.quotaLimit ? "is-invalid" : ""}`} id="quotaLimit" name="quotaLimit" value={formData.quotaLimit} onChange={handleChange} placeholder="Enter quota limit" min="1" />
          {errors.quotaLimit && <div className="invalid-feedback">{errors.quotaLimit}</div>}
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="water" className="form-label">
            Ketersediaan Air <span className="text-danger">*</span>
          </label>
          <input type="text" className={`form-control ${errors.water ? "is-invalid" : ""}`} id="water" name="water" value={formData.water} onChange={handleChange} placeholder="Describe water availability" />
          {errors.water && <div className="invalid-feedback">{errors.water}</div>}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="form-check">
            <input type="checkbox" className="form-check-input" id="isOpen" name="isOpen" checked={formData.isOpen} onChange={handleChange} />
            <label className="form-check-label" htmlFor="isOpen">
              Terbuka untuk di-daki
            </label>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="form-check">
            <input type="checkbox" className="form-check-input" id="toilet" name="toilet" checked={formData.toilet} onChange={handleChange} />
            <label className="form-check-label" htmlFor="toilet">
              Toilet Tersedia
            </label>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label">
          Deskripsi <span className="text-danger">*</span>
        </label>
        <textarea className={`form-control ${errors.description ? "is-invalid" : ""}`} id="description" name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Enter mountain description"></textarea>
        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
      </div>

      {!isEditMode && (
        <div className="card mb-3">
          <div className="card-header">
            <h5 className="mb-0">Informasi Ranger</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="ranger.name" className="form-label">
                  Nama Ranger <span className="text-danger">*</span>
                </label>
                <input type="text" className={`form-control ${errors["ranger.name"] ? "is-invalid" : ""}`} id="ranger.name" name="ranger.name" value={formData.assigned_ranger.name} onChange={handleChange} placeholder="Enter ranger name" />
                {errors["ranger.name"] && <div className="invalid-feedback">{errors["ranger.name"]}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="ranger.phone_number" className="form-label">
                  Nomor Telepon <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors["ranger.phone_number"] ? "is-invalid" : ""}`}
                  id="ranger.phone_number"
                  name="ranger.phone_number"
                  value={formData.assigned_ranger.phone_number}
                  onChange={handleChange}
                  placeholder="Enter ranger phone number"
                />
                {errors["ranger.phone_number"] && <div className="invalid-feedback">{errors["ranger.phone_number"]}</div>}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="ranger.email" className="form-label">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors["ranger.email"] ? "is-invalid" : ""}`}
                  id="ranger.email"
                  name="ranger.email"
                  value={formData.assigned_ranger.email}
                  onChange={handleChange}
                  placeholder="Enter ranger email"
                />
                {errors["ranger.email"] && <div className="invalid-feedback">{errors["ranger.email"]}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="ranger.password" className="form-label">
                  Password <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  className={`form-control ${errors["ranger.password"] ? "is-invalid" : ""}`}
                  id="ranger.password"
                  name="ranger.password"
                  value={formData.assigned_ranger.password}
                  onChange={handleChange}
                  placeholder="Enter ranger password"
                />
                {errors["ranger.password"] && <div className="invalid-feedback">{errors["ranger.password"]}</div>}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isLoading}>
          Batal
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? <Loading /> : isEditMode ? "Update Mountain" : "Create Mountain"}
        </button>
      </div>
    </form>
  );
};

export default MountainForm;
