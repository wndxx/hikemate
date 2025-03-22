"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllRangers } from "../api/rangers";
import Loading from "../components/loading/Loading";

const RangersTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [rangers, setRangers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalElements: 0,
    hasNext: false,
    hasPrevious: false,
  });

  const navigate = useNavigate();

  // Fetch rangers on component mount and when page changes
  useEffect(() => {
    fetchRangers();
  }, [currentPage]);

  // Fetch rangers from API
  const fetchRangers = async (page = currentPage) => {
    setIsLoading(true);
    try {
      const result = await getAllRangers(page, 10);
      if (result.success) {
        setRangers(result.rangers);
        setPagination(result.pagination);
      } else {
        console.error("Failed to fetch rangers:", result.message);
      }
    } catch (error) {
      console.error("Error fetching rangers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter rangers based on search query
  const filteredRangers = rangers.filter(
    (ranger) => ranger.name.toLowerCase().includes(searchQuery.toLowerCase()) || ranger.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) || ranger.mountainResponse.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle view detail
  const handleViewDetail = (ranger) => {
    navigate(`/ranger/${ranger.id}`);
  };

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

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">Rangers Management</h2>

      {/* Search Bar */}
      <div className="mb-3">
        <input type="text" className="form-control" placeholder="Search by name, phone number or mountain..." value={searchQuery} onChange={handleSearchChange} />
      </div>

      {/* Rangers Table */}
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
                <th>Phone Number</th>
                <th>Mountain</th>
                <th>Assigned At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRangers.length > 0 ? (
                filteredRangers.map((ranger) => (
                  <tr key={ranger.id}>
                    <td>{ranger.id.substring(0, 8)}...</td>
                    <td>{ranger.name}</td>
                    <td>{ranger.phoneNumber}</td>
                    <td>{ranger.mountainResponse.name}</td>
                    <td>{formatDate(ranger.assignedAt)}</td>
                    <td>
                      <button className="btn btn-info btn-sm" onClick={() => handleViewDetail(ranger)} title="View Details">
                        <i className="bi bi-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No rangers found
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
            <li className={`page-item ${!pagination.hasPrevious ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={!pagination.hasPrevious}>
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
            <li className={`page-item ${!pagination.hasNext ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={!pagination.hasNext}>
                &gt;
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default RangersTable;
