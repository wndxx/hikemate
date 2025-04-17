"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getMountainById } from "../api/mountains";
import { getRangerByMountainId } from "../api/rangers";
import Loading from "../components/loading/Loading";
import Layout from "../components/layout/Layout";

const ViewMountain = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mountain, setMountain] = useState(null);
  const [ranger, setRanger] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchMountainData = async () => {
      setIsLoading(true);
      try {
        const result = await getMountainById(id);
        if (result.success) {
          // Transform the data to match expected structure
          const transformedMountain = {
            ...result.mountain,
            mountainCoverUrl: result.mountain.image,
            status: result.mountain.difficulty,
            isOpen: true, // Default value
            toilet: false, // Default value
            water: "Available at basecamp", // Default value
            quotaLimit: 100, // Default value
            mountainRoutes: [], // Empty array
            baseCampImagesUrl: [result.mountain.image], // Use main image
            createdAt: result.mountain.created_at,
            updatedAt: result.mountain.created_at // Using created_at as updated_at
          };
          
          setMountain(transformedMountain);

          // Fetch ranger data if available
          try {
            const rangerResult = await getRangerByMountainId(id);
            if (rangerResult.success && rangerResult.ranger) {
              setRanger(rangerResult.ranger);
            }
          } catch (rangerError) {
            console.error("Error fetching ranger:", rangerError);
          }
        } else {
          setError(result.message || "Failed to fetch mountain details");
        }
      } catch (error) {
        console.error("Error fetching mountain:", error);
        setError("An error occurred while fetching mountain details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMountainData();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <Layout showFooter={false}>
        <div className="container-fluid p-4">
          <div className="text-center py-5">
            <Loading />
            <p className="mt-3">Loading mountain data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !mountain) {
    return (
      <Layout showFooter={false}>
        <div className="container-fluid p-4">
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error || "Mountain not found"}
          </div>
          <button className="btn btn-secondary" onClick={() => navigate("/dashboard/mountains")}>
            <i className="bi bi-arrow-left me-2"></i>Back to Mountains
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showFooter={false}>
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">{mountain.name}</h2>
          <div className="d-flex gap-2">
            <Link to="/dashboard/mountains" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left me-2"></i>Back to Mountains
            </Link>
            <Link to={`/dashboard/mountains/edit/${mountain.id}`} className="btn btn-primary">
              <i className="bi bi-pencil me-2"></i>Edit Mountain
            </Link>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            <div className="card shadow-sm mb-4">
              <div className="card-body p-0">
                <div className="position-relative">
                  {mountain.mountainCoverUrl ? (
                    <img 
                      src={mountain.mountainCoverUrl} 
                      alt={mountain.name} 
                      className="img-fluid w-100" 
                      style={{ maxHeight: "400px", objectFit: "cover" }} 
                    />
                  ) : (
                    <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: "300px" }}>
                      <i className="bi bi-image text-muted display-1"></i>
                    </div>
                  )}
                  <div className="position-absolute top-0 end-0 m-3">
                    <span className={`badge fs-6 bg-${mountain.status === "Extreme" ? "danger" : mountain.status === "Hard" ? "warning" : "success"}`}>
                      {mountain.status}
                    </span>
                  </div>
                </div>

                <ul className="nav nav-tabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button className={`nav-link ${activeTab === "details" ? "active" : ""}`} onClick={() => setActiveTab("details")}>
                      <i className="bi bi-info-circle me-2"></i>Details
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className={`nav-link ${activeTab === "routes" ? "active" : ""}`} onClick={() => setActiveTab("routes")}>
                      <i className="bi bi-signpost-split me-2"></i>Routes
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className={`nav-link ${activeTab === "images" ? "active" : ""}`} onClick={() => setActiveTab("images")}>
                      <i className="bi bi-images me-2"></i>Images
                    </button>
                  </li>
                </ul>

                <div className="tab-content p-4">
                  {/* Details Tab */}
                  {activeTab === "details" && (
                    <div role="tabpanel">
                      <div className="row mb-4">
                        <div className="col-md-6">
                          <h5 className="mb-3">Basic Information</h5>
                          <table className="table table-borderless">
                            <tbody>
                              <tr>
                                <th scope="row" style={{ width: "40%" }}>Name</th>
                                <td>{mountain.name}</td>
                              </tr>
                              <tr>
                                <th scope="row">Location</th>
                                <td>{mountain.location}</td>
                              </tr>
                              <tr>
                                <th scope="row">Elevation</th>
                                <td>{mountain.elevation} meters</td>
                              </tr>
                              <tr>
                                <th scope="row">Price</th>
                                <td>{formatPrice(mountain.price)}</td>
                              </tr>
                              <tr>
                                <th scope="row">Difficulty</th>
                                <td>{mountain.difficulty}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="col-md-6">
                          <h5 className="mb-3">Additional Information</h5>
                          <table className="table table-borderless">
                            <tbody>
                              <tr>
                                <th scope="row" style={{ width: "40%" }}>ID</th>
                                <td>{mountain.id}</td>
                              </tr>
                              <tr>
                                <th scope="row">Created At</th>
                                <td>{formatDate(mountain.createdAt)}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <h5 className="mb-3">Description</h5>
                      <p style={{ textAlign: "justify" }}>{mountain.description}</p>
                    </div>
                  )}

                  {/* Routes Tab */}
                  {activeTab === "routes" && (
                    <div role="tabpanel">
                      <h5 className="mb-3">Climbing Routes</h5>
                      <div className="alert alert-info">
                        <i className="bi bi-info-circle me-2"></i>
                        Route information not available in demo data.
                      </div>
                    </div>
                  )}

                  {/* Images Tab */}
                  {activeTab === "images" && (
                    <div role="tabpanel">
                      <h5 className="mb-3">Mountain Images</h5>
                      <div className="row g-2 mb-3">
                        <div className="col-md-3 col-6">
                          <img
                            src={mountain.mountainCoverUrl}
                            alt="Main view"
                            className={`img-thumbnail cursor-pointer ${activeImage === 0 ? "border-primary" : ""}`}
                            style={{
                              height: "100px",
                              width: "100%",
                              objectFit: "cover",
                              cursor: "pointer",
                              borderWidth: activeImage === 0 ? "3px" : "1px",
                            }}
                            onClick={() => setActiveImage(0)}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <img 
                          src={mountain.mountainCoverUrl} 
                          alt="Mountain view" 
                          className="img-fluid rounded" 
                          style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }} 
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            {/* Ranger Information */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <i className="bi bi-person-badge me-2"></i>Ranger Information
                </h5>
              </div>
              <div className="card-body">
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  Ranger information not available in demo data.
                </div>
              </div>
            </div>

            {/* Quick Facts */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <i className="bi bi-lightbulb me-2"></i>Quick Facts
                </h5>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span>Elevation</span>
                    <span className="badge bg-primary rounded-pill">{mountain.elevation}m</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span>Difficulty</span>
                    <span className={`badge rounded-pill bg-${mountain.difficulty === "Extreme" ? "danger" : mountain.difficulty === "Hard" ? "warning" : "success"}`}>
                      {mountain.difficulty}
                    </span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span>Location</span>
                    <span className="text-muted">{mountain.location}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <i className="bi bi-lightning-charge me-2"></i>Quick Actions
                </h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <Link to={`/dashboard/mountains/edit/${mountain.id}`} className="btn btn-primary">
                    <i className="bi bi-pencil me-2"></i>Edit Mountain
                  </Link>
                  <Link to={`/mountain/${mountain.id}`} className="btn btn-outline-primary" target="_blank">
                    <i className="bi bi-eye me-2"></i>View Public Page
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewMountain;