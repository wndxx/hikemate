import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HikerForm = ({ hiker, onSubmit }) => {
  const navigate = useNavigate();

  // State untuk form
  const [name, setName] = useState(hiker?.name || "");
  const [email, setEmail] = useState(hiker?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(hiker?.phoneNumber || "");
  const [ktpFile, setKtpFile] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [previewKtp, setPreviewKtp] = useState(hiker?.ktp?.url || null);
  const [previewProfilePicture, setPreviewProfilePicture] = useState(hiker?.profilePicture?.url || null);

  // Handle perubahan input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    if (name === "email") setEmail(value);
    if (name === "phoneNumber") setPhoneNumber(value);
  };

  // Handle upload KTP
  const handleKtpChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setKtpFile(file);
      setPreviewKtp(URL.createObjectURL(file)); // Menampilkan preview KTP
    }
  };

  // Handle upload foto profil
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      setPreviewProfilePicture(URL.createObjectURL(file)); // Menampilkan preview foto profil
    }
  };

  // Handle submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phoneNumber", phoneNumber);
    if (ktpFile) formData.append("ktp", ktpFile);
    if (profilePictureFile) formData.append("profilePicture", profilePictureFile);

    onSubmit(formData); // Kirim data ke parent component atau API
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h1 className="h4 mb-0">{hiker ? "Edit Hiker" : "Add New Hiker"}</h1>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Field Nama */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={name}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Field Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Field Nomor Telepon */}
            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number
              </label>
              <input
                type="text"
                className="form-control"
                id="phoneNumber"
                name="phoneNumber"
                value={phoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Field KTP */}
            <div className="mb-3">
              <label htmlFor="ktp" className="form-label">
                KTP
              </label>
              <input
                type="file"
                className="form-control"
                id="ktp"
                name="ktp"
                onChange={handleKtpChange}
                accept="image/*"
              />
              {previewKtp && (
                <div className="mt-3">
                  <img
                    src={previewKtp}
                    alt="Preview KTP"
                    className="img-thumbnail"
                    style={{ width: "150px", height: "auto" }}
                  />
                </div>
              )}
            </div>

            {/* Field Foto Profil */}
            <div className="mb-3">
              <label htmlFor="profilePicture" className="form-label">
                Profile Picture
              </label>
              <input
                type="file"
                className="form-control"
                id="profilePicture"
                name="profilePicture"
                onChange={handleProfilePictureChange}
                accept="image/*"
              />
              {previewProfilePicture && (
                <div className="mt-3">
                  <img
                    src={previewProfilePicture}
                    alt="Preview Profile Picture"
                    className="img-thumbnail"
                    style={{ width: "150px", height: "auto" }}
                  />
                </div>
              )}
            </div>

            {/* Tombol Aksi */}
            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(-1)} // Kembali ke halaman sebelumnya
              >
                <i className="bi bi-arrow-left me-2"></i>Back
              </button>
              <button type="submit" className="btn btn-primary">
                <i className="bi bi-save me-2"></i>Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HikerForm;