import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../store/slice/profileSlice";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // State untuk form edit data diri
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || null);
  const [previewImage, setPreviewImage] = useState(user?.profilePicture || null);

  // Handle perubahan input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    if (name === "email") setEmail(value);
  };

  // Handle upload foto profil
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewImage(URL.createObjectURL(file)); // Menampilkan preview gambar
    }
  };

  // Handle submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      username,
      email,
      profilePicture,
    };
    dispatch(updateProfile(updatedData)); // Dispatch action untuk update profile
    setEditMode(false); // Keluar dari mode edit
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
                      src={user.profilePicture || "https://via.placeholder.com/150"}
                      alt="Profile"
                      className="rounded-circle img-thumbnail"
                      style={{ width: "150px", height: "150px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="mb-3">
                    <p className="mb-1">
                      <strong>Username:</strong> {user.username}
                    </p>
                    <p className="mb-0">
                      <strong>Email:</strong> {user.email}
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
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={username}
                      onChange={handleInputChange}
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
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="profilePicture" className="form-label">
                      Foto Profil
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="profilePicture"
                      name="profilePicture"
                      onChange={handleFileChange}
                    />
                    {previewImage && (
                      <div className="mt-3 text-center">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="img-thumbnail"
                          style={{ width: "100px", height: "100px", objectFit: "cover" }}
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
                      <i className="bi bi-x-circle me-2"></i>Batal
                    </button>
                    <button type="submit" className="btn btn-success">
                      <i className="bi bi-save me-2"></i>Simpan Perubahan
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