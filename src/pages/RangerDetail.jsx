"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRangerById } from "../api/rangers";
import Layout from "../components/layout/Layout";
import Loading from "../components/loading/Loading";

const RangerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ranger, setRanger] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRangerData = async () => {
      setIsLoading(true);
      try {
        const result = await getRangerById(id);
        if (result.success) {
          setRanger(result.ranger);
        } else {
          setError(result.message || "Failed to load ranger details");
        }
      } catch (error) {
        console.error("Error fetching ranger:", error);
        setError("An error occurred while fetching ranger details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRangerData();
  }, [id]);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  if (error || !ranger) {
    return (
      <Layout>
        <div className="container mt-5">
          <div className="alert alert-danger">{error || "Ranger not found"}</div>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-2"></i>Back
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mt-5 mb-5">
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <h1 className="h4 mb-0">Ranger Details</h1>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="card h-100">
                  <div className="card-header">
                    <h5 className="mb-0">Ranger Information</h5>
                  </div>
                  <div className="card-body">
                    <p className="mb-2">
                      <strong>ID:</strong> {ranger.id}
                    </p>
                    <p className="mb-2">
                      <strong>Name:</strong> {ranger.name}
                    </p>
                    <p className="mb-2">
                      <strong>Phone Number:</strong> {ranger.phoneNumber}
                    </p>
                    <p className="mb-2">
                      <strong>Assigned At:</strong> {formatDate(ranger.assignedAt)}
                    </p>
                    <p className="mb-2">
                      <strong>Created At:</strong> {formatDate(ranger.createdAt)}
                    </p>
                    <p className="mb-2">
                      <strong>Updated At:</strong> {formatDate(ranger.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <div className="card h-100">
                  <div className="card-header">
                    <h5 className="mb-0">Assigned Mountain</h5>
                  </div>
                  <div className="card-body">
                    {ranger.mountainResponse && (
                      <>
                        <div className="mb-3">
                          {ranger.mountainResponse.mountainCoverUrl ? (
                            <img src={ranger.mountainResponse.mountainCoverUrl || "/placeholder.svg"} alt={ranger.mountainResponse.name} className="img-fluid rounded" style={{ maxHeight: "200px", objectFit: "cover", width: "100%" }} />
                          ) : (
                            <div className="bg-light text-center p-5 rounded">
                              <i className="bi bi-image text-muted display-4"></i>
                              <p className="mt-2">No image available</p>
                            </div>
                          )}
                        </div>
                        <p className="mb-2">
                          <strong>Mountain Name:</strong> {ranger.mountainResponse.name}
                        </p>
                        <p className="mb-2">
                          <strong>Location:</strong> {ranger.mountainResponse.location}
                        </p>
                        <p className="mb-2">
                          <strong>Status:</strong>{" "}
                          <span
                            className={`badge ${
                              ranger.mountainResponse.status === "SAFE" || ranger.mountainResponse.status === "OPEN"
                                ? "bg-success"
                                : ranger.mountainResponse.status === "WARNING"
                                ? "bg-warning"
                                : ranger.mountainResponse.status === "DANGEROUS"
                                ? "bg-danger"
                                : "bg-secondary"
                            }`}
                          >
                            {ranger.mountainResponse.status}
                          </span>
                        </p>
                        <p className="mb-2">
                          <strong>Is Open:</strong> <span className={`badge ${ranger.mountainResponse.isOpen ? "bg-success" : "bg-danger"}`}>{ranger.mountainResponse.isOpen ? "Yes" : "No"}</span>
                        </p>
                        <p className="mb-2">
                          <strong>Quota Limit:</strong> {ranger.mountainResponse.quotaLimit} hikers
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {ranger.mountainResponse && (
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="mb-0">Mountain Description</h5>
                </div>
                <div className="card-body">
                  <p>{ranger.mountainResponse.description}</p>
                </div>
              </div>
            )}

            <div className="d-flex justify-content-between">
              <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                <i className="bi bi-arrow-left me-2"></i>Back to Rangers
              </button>
              <button className="btn btn-primary" onClick={() => navigate(`/mountain/${ranger.mountainResponse.id}`)}>
                <i className="bi bi-mountain me-2"></i>View Mountain Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RangerDetail;
