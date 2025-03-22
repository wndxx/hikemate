import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { user } = useSelector((state) => state.auth); // Asumsikan user data disimpan di Redux
  const navigate = useNavigate();

  // State untuk form edit data diri
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || "");
  const [ktpFile, setKtpFile] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [previewKtp, setPreviewKtp] = useState(user?.ktp?.url || null);
  const [previewProfilePicture, setPreviewProfilePicture] = useState(user?.profile_picture?.url || null);

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
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone_number", phoneNumber);
    if (ktpFile) formData.append("ktp", ktpFile);
    if (profilePictureFile) formData.append("profile_picture", profilePictureFile);

    try {
      const response = await axios.patch("http://localhost:8080/api/v1/hikers", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ambil token dari localStorage
        },
      });

      console.log("Profile updated:", response.data);
      alert("Profile updated successfully!"); // Tampilkan feedback ke pengguna
      setEditMode(false); // Keluar dari mode edit
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again."); // Tampilkan feedback error
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h1 className="h4 mb-0">Profile</h1>
        </div>
        <div className="card-body">
          {user ? (
            <div>
              {!editMode ? (
                // Tampilkan data profil
                <div className="text-center">
                  <div className="mb-4">
                    <img
                      src={user.profile_picture?.url || "https://via.placeholder.com/150"}
                      alt="Profile"
                      className="rounded-circle img-thumbnail"
                      style={{ width: "150px", height: "150px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="mb-3">
                    <p className="mb-1">
                      <strong>Name:</strong> {user.name}
                    </p>
                    <p className="mb-1">
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p className="mb-1">
                      <strong>Phone Number:</strong> {user.phone_number || "N/A"}
                    </p>
                    <p className="mb-0">
                      <strong>KTP:</strong>{" "}
                      {user.ktp?.url ? (
                        <a href={user.ktp.url} target="_blank" rel="noopener noreferrer">
                          View KTP
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => setEditMode(true)}
                  >
                    <i className="bi bi-pencil me-2"></i>Edit Profile
                  </button>
                </div>
              ) : (
                // Form edit data diri
                <form onSubmit={handleSubmit}>
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

                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={() => setEditMode(false)}
                    >
                      <i className="bi bi-x-circle me-2"></i>Cancel
                    </button>
                    <button type="submit" className="btn btn-success">
                      <i className="bi bi-save me-2"></i>Save Changes
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <p className="text-center">No user data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;