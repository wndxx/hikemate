"use client";

import { useState, useEffect } from "react";
import { getMountainById } from "../api/mountains";
import { getRangerByMountainId } from "../api/rangers";
import Loading from "../components/loading/Loading";

const ViewMountainModal = ({ mountainId, onClose }) => {
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
        const result = await getMountainById(mountainId);
        if (result.success) {
          setMountain(result.mountain);

          // After getting mountain data, fetch the ranger data
          try {
            const rangerResult = await getRangerByMountainId(mountainId);
            console.log("Ranger API response:", rangerResult);
            if (rangerResult.success && rangerResult.ranger) {
              setRanger(rangerResult.ranger);
            }
          } catch (rangerError) {
            console.error("Error fetching ranger:", rangerError);
            // Don't set the main error - just log it since ranger data is supplementary
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

    if (mountainId) {
      fetchMountainData();
    }
  }, [mountainId]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format price to IDR
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{isLoading ? "Loading..." : mountain ? mountain.name : "Mountain Details"}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {isLoading ? (
              <div className="text-center py-4">
                <Loading />
                <p className="mt-3">Loading mountain data...</p>
              </div>
            ) : error || !mountain ? (
              <div className="alert alert-danger">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error || "Mountain not found"}
              </div>
            ) : (
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg-8">
                    <div className="card shadow-sm mb-4">
                      <div className="card-body p-0">
                        <div className="position-relative">
                          {mountain.mountainCoverUrl ? (
                            <img src={mountain.mountainCoverUrl || "/placeholder.svg"} alt={mountain.name} className="img-fluid w-100" style={{ maxHeight: "300px", objectFit: "cover" }} />
                          ) : (
                            <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: "200px" }}>
                              <i className="bi bi-image text-muted display-1"></i>
                            </div>
                          )}
                          <div className="position-absolute top-0 end-0 m-3">
                            <span
                              className={`badge fs-6 bg-${
                                mountain.status === "SAFE" ? "success" : mountain.status === "OPEN" ? "success" : mountain.status === "WARNING" ? "warning" : mountain.status === "DANGEROUS" ? "danger" : "secondary"
                              }`}
                            >
                              {mountain.status}
                            </span>
                          </div>
                          <div className="position-absolute top-0 start-0 m-3">
                            <span className={`badge fs-6 ${mountain.isOpen ? "bg-success" : "bg-danger"}`}>{mountain.isOpen ? "Open" : "Closed"}</span>
                          </div>
                        </div>

                        <ul className="nav nav-tabs" role="tablist">
                          <li className="nav-item" role="presentation">
                            <button className={`nav-link ${activeTab === "details" ? "active" : ""}`} onClick={() => setActiveTab("details")} type="button" role="tab">
                              <i className="bi bi-info-circle me-2"></i>Details
                            </button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button className={`nav-link ${activeTab === "routes" ? "active" : ""}`} onClick={() => setActiveTab("routes")} type="button" role="tab">
                              <i className="bi bi-signpost-split me-2"></i>Routes
                            </button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button className={`nav-link ${activeTab === "images" ? "active" : ""}`} onClick={() => setActiveTab("images")} type="button" role="tab">
                              <i className="bi bi-images me-2"></i>Images
                            </button>
                          </li>
                        </ul>

                        <div className="tab-content p-3">
                          {/* Details Tab */}
                          {activeTab === "details" && (
                            <div role="tabpanel">
                              <div className="row">
                                <div className="col-md-6">
                                  <h5 className="mb-3">Basic Information</h5>
                                  <table className="table table-borderless">
                                    <tbody>
                                      <tr>
                                        <th scope="row" style={{ width: "40%" }}>
                                          Name
                                        </th>
                                        <td>{mountain.name}</td>
                                      </tr>
                                      <tr>
                                        <th scope="row">Location</th>
                                        <td>{mountain.location}</td>
                                      </tr>
                                      <tr>
                                        <th scope="row">Price</th>
                                        <td>{formatPrice(mountain.price)}</td>
                                      </tr>
                                      <tr>
                                        <th scope="row">Quota Limit</th>
                                        <td>{mountain.quotaLimit} hikers</td>
                                      </tr>
                                      <tr>
                                        <th scope="row">Toilet Available</th>
                                        <td>{mountain.toilet ? "Yes" : "No"}</td>
                                      </tr>
                                      <tr>
                                        <th scope="row">Water</th>
                                        <td>{mountain.water}</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                                <div className="col-md-6">
                                  <h5 className="mb-3">Additional Information</h5>
                                  <table className="table table-borderless">
                                    <tbody>
                                      <tr>
                                        <th scope="row" style={{ width: "40%" }}>
                                          ID
                                        </th>
                                        <td>{mountain.id}</td>
                                      </tr>
                                      <tr>
                                        <th scope="row">Created At</th>
                                        <td>{formatDate(mountain.createdAt)}</td>
                                      </tr>
                                      <tr>
                                        <th scope="row">Updated At</th>
                                        <td>{formatDate(mountain.updatedAt)}</td>
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
                              <h5 className="mb-3">Available Routes</h5>
                              {mountain.mountainRoutes && mountain.mountainRoutes.length > 0 ? (
                                <div className="list-group">
                                  {mountain.mountainRoutes.map((route, index) => (
                                    <div key={route.id || index} className="list-group-item list-group-item-action">
                                      <div className="d-flex w-100 justify-content-between">
                                        <h6 className="mb-1">{route.routeName || "Route Name Not Available"}</h6>
                                        <small className="text-muted">ID: {route.routeId || route.id}</small>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="alert alert-info">
                                  <i className="bi bi-info-circle me-2"></i>
                                  No routes have been defined for this mountain.
                                </div>
                              )}
                            </div>
                          )}

                          {/* Images Tab */}
                          {activeTab === "images" && (
                            <div role="tabpanel">
                              <h5 className="mb-3">Basecamp Images</h5>
                              {mountain.baseCampImagesUrl && mountain.baseCampImagesUrl.length > 0 ? (
                                <div>
                                  <div className="row g-2 mb-3">
                                    {mountain.baseCampImagesUrl.map((imageUrl, index) => (
                                      <div className="col-md-3 col-6" key={index}>
                                        <img
                                          src={imageUrl || "/placeholder.svg"}
                                          alt={`Basecamp ${index + 1}`}
                                          className={`img-thumbnail cursor-pointer ${activeImage === index ? "border-primary" : ""}`}
                                          style={{
                                            height: "80px",
                                            width: "100%",
                                            objectFit: "cover",
                                            cursor: "pointer",
                                            borderWidth: activeImage === index ? "3px" : "1px",
                                          }}
                                          onClick={() => setActiveImage(index)}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                  <div className="mt-3">
                                    <img src={mountain.baseCampImagesUrl[activeImage] || "/placeholder.svg"} alt="Selected basecamp" className="img-fluid rounded" style={{ maxHeight: "300px", width: "100%", objectFit: "cover" }} />
                                  </div>
                                </div>
                              ) : (
                                <div className="alert alert-info">
                                  <i className="bi bi-info-circle me-2"></i>
                                  No basecamp images available for this mountain.
                                </div>
                              )}
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
                        {ranger ? (
                          <div>
                            <div className="d-flex align-items-center mb-3">
                              <div className="bg-light rounded-circle p-3 me-3">
                                <i className="bi bi-person-fill fs-3"></i>
                              </div>
                              <div>
                                <h5 className="mb-1">{ranger.name}</h5>
                                <p className="text-muted mb-0">Assigned Ranger</p>
                              </div>
                            </div>
                            <table className="table table-borderless">
                              <tbody>
                                <tr>
                                  <th scope="row" style={{ width: "40%" }}>
                                    Phone
                                  </th>
                                  <td>{ranger.phoneNumber}</td>
                                </tr>
                                {ranger.assignedAt && (
                                  <tr>
                                    <th scope="row">Assigned At</th>
                                    <td>{formatDate(ranger.assignedAt)}</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="alert alert-warning">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            No ranger has been assigned to this mountain.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMountainModal;
