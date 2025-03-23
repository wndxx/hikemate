"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/layout/Layout";
import Loading from "../components/loading/Loading";
import { getProfile, updateProfile } from "../api/profile";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // State for profile data
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // State for file uploads
  const [ktpFile, setKtpFile] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [previewKtp, setPreviewKtp] = useState(null);
  const [previewProfilePicture, setPreviewProfilePicture] = useState(null);

  // State for UI
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasKtp, setHasKtp] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        // Check if token exists and can be decoded
        const token = localStorage.getItem("token");
        if (!token) {
          setErrors({ submit: "Authentication token not found. Please log in again." });
          navigate("/login");
          return;
        }

        try {
          const decoded = jwtDecode(token);
          console.log("Token decoded successfully:", decoded);
          if (!decoded.userLoggedInId) {
            setErrors({ submit: "User ID not found in token. Please log in again." });
            navigate("/login");
            return;
          }
        } catch (tokenError) {
          console.error("Error decoding token:", tokenError);
          setErrors({ submit: "Invalid authentication token. Please log in again." });
          navigate("/login");
          return;
        }

        const result = await getProfile();
        console.log("Profile fetch result:", result);

        if (result.success) {
          // Extract data from the response with the correct field names
          const { name, email, phoneNumber, ktpUrl, profilePictureUrl } = result.data;

          setProfileData({
            name: name || "",
            email: email || "",
            phone: phoneNumber || "", // Map phoneNumber from API to phone in our state
            password: "",
            confirmPassword: "",
          });

          if (ktpUrl) {
            setPreviewKtp(ktpUrl);
            setHasKtp(true);
          }

          if (profilePictureUrl) {
            setPreviewProfilePicture(profilePictureUrl);
          }
        } else {
          console.error("Failed to fetch profile:", result.message);
          setErrors({ submit: result.message || "Failed to load profile data" });
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setErrors({ submit: "An error occurred while loading profile data" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Handle KTP file change
  const handleKtpChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setKtpFile(file);
      setPreviewKtp(URL.createObjectURL(file));
    }
  };

  // Handle profile picture change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      setPreviewProfilePicture(URL.createObjectURL(file));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!profileData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!profileData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (profileData.password && profileData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (profileData.password !== profileData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSaving(true);
    setSuccessMessage("");
    setErrors({});

    try {
      // Log the data we're sending
      console.log("Submitting profile update with data:", {
        name: profileData.name,
        phone: profileData.phone,
        email: profileData.email,
        password: profileData.password ? "********" : "(not changed)",
        ktpFile: ktpFile ? ktpFile.name : "none",
        profilePictureFile: profilePictureFile ? profilePictureFile.name : "none",
      });

      // Check file types if files are provided
      if (ktpFile) {
        console.log("KTP file type:", ktpFile.type);
        if (!ktpFile.type.startsWith("image/")) {
          setErrors({ submit: "KTP file must be an image" });
          setIsSaving(false);
          return;
        }
      }

      if (profilePictureFile) {
        console.log("Profile picture file type:", profilePictureFile.type);
        if (!profilePictureFile.type.startsWith("image/")) {
          setErrors({ submit: "Profile picture must be an image" });
          setIsSaving(false);
          return;
        }
      }

      // Create a copy of profileData to ensure password is properly handled
      const profileDataToSend = {
        name: profileData.name,
        phone: profileData.phone,
        email: profileData.email,
        // Always send the password field, even if empty
        password: profileData.password || "",
      };

      const result = await updateProfile(profileDataToSend, ktpFile, profilePictureFile);

      console.log("Profile update result:", result);

      if (result.success) {
        setSuccessMessage(result.message || "Profile updated successfully!");
        setEditMode(false);

        // Update local storage with new user data if needed
        if (token) {
          const decoded = jwtDecode(token);
          const updatedUser = {
            ...user,
            name: profileData.name,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }

        // Reset password fields after successful update
        setProfileData((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));
      } else {
        // Display detailed error message
        setErrors({
          submit: result.message || "Failed to update profile",
        });

        // Log detailed error information
        if (result.errorDetails) {
          console.error("Detailed error:", result.errorDetails);
        }
      }
    } catch (error) {
      console.error("Error in submit handler:", error);
      setErrors({ submit: "An error occurred while updating profile" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mt-5 text-center">
          <Loading />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h1 className="h4 mb-0">My Profile</h1>
              </div>
              <div className="card-body">
                {successMessage && (
                  <div className="alert alert-success mb-4" role="alert">
                    {successMessage}
                  </div>
                )}

                {errors.submit && (
                  <div className="alert alert-danger mb-4" role="alert">
                    <strong>Error:</strong> {errors.submit}
                    <div className="mt-2">
                      <small>Please check the console for more details or try again later.</small>
                    </div>
                  </div>
                )}

                {!editMode ? (
                  // View mode
                  <div>
                    <div className="text-center mb-4">
                      <img src={previewProfilePicture || "https://via.placeholder.com/150"} alt="Profile" className="rounded-circle img-thumbnail" style={{ width: "150px", height: "150px", objectFit: "cover" }} />
                      <h3 className="mt-3">{profileData.name}</h3>
                      <p className="text-muted">{profileData.email}</p>
                    </div>

                    <div className="row mb-4">
                      <div className="col-md-6">
                        <h5>Contact Information</h5>
                        <p>
                          <strong>Phone:</strong> {profileData.phone || "Not provided"}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h5>Identity</h5>
                        {previewKtp ? (
                          <div>
                            <p>
                              <strong>KTP:</strong>{" "}
                              <a href={previewKtp} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                View KTP
                              </a>
                            </p>
                          </div>
                        ) : (
                          <p>
                            <strong>KTP:</strong> Not uploaded
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="d-flex justify-content-center">
                      <button className="btn btn-primary" onClick={() => setEditMode(true)}>
                        <i className="bi bi-pencil me-2"></i>Edit Profile
                      </button>
                    </div>
                  </div>
                ) : (
                  // Edit mode
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-4">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label">
                            Name <span className="text-danger">*</span>
                          </label>
                          <input type="text" className={`form-control ${errors.name ? "is-invalid" : ""}`} id="name" name="name" value={profileData.name} onChange={handleInputChange} required />
                          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">
                            Email
                          </label>
                          <input type="email" className="form-control" id="email" name="email" value={profileData.email} disabled />
                          <small className="text-muted">Email cannot be changed</small>
                        </div>

                        <div className="mb-3">
                          <label htmlFor="phone" className="form-label">
                            Phone Number <span className="text-danger">*</span>
                          </label>
                          <input type="text" className={`form-control ${errors.phone ? "is-invalid" : ""}`} id="phone" name="phone" value={profileData.phone} onChange={handleInputChange} required />
                          {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="password" className="form-label">
                            Password
                          </label>
                          <input
                            type="password"
                            className={`form-control ${errors.password ? "is-invalid" : ""}`}
                            id="password"
                            name="password"
                            value={profileData.password}
                            onChange={handleInputChange}
                            placeholder="Leave blank to keep current password"
                          />
                          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="confirmPassword" className="form-label">
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={profileData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm new password"
                          />
                          {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                        </div>
                      </div>
                    </div>

                    <div className="row mb-4">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="ktp" className="form-label">
                            KTP
                          </label>
                          <input type="file" className="form-control" id="ktp" onChange={handleKtpChange} accept="image/*" disabled={hasKtp} />
                          {hasKtp && <small className="text-muted d-block mt-1">KTP already uploaded and cannot be changed</small>}
                          {previewKtp && (
                            <div className="mt-2">
                              <img src={previewKtp || "/placeholder.svg"} alt="KTP Preview" className="img-thumbnail" style={{ maxHeight: "150px" }} />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="profilePicture" className="form-label">
                            Profile Picture
                          </label>
                          <input type="file" className="form-control" id="profilePicture" onChange={handleProfilePictureChange} accept="image/*" />
                          {previewProfilePicture && (
                            <div className="mt-2">
                              <img src={previewProfilePicture || "/placeholder.svg"} alt="Profile Picture Preview" className="img-thumbnail" style={{ maxHeight: "150px" }} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-center gap-2">
                      <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)} disabled={isSaving}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary" disabled={isSaving}>
                        {isSaving ? <Loading /> : "Save Changes"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
