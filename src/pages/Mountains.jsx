import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import MountainCard from "../components/mountainCard/MountainCard";
import Loading from "../components/loading/Loading";
import mockApi from "../api/mockApi";

const Mountains = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [mountainsData, setMountainsData] = useState([]);
  const [filteredMountains, setFilteredMountains] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 1,
  });

  // Fetch mountains data
  useEffect(() => {
    const fetchMountains = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await mockApi.getMountains();
        if (response.data) {
          setMountainsData(response.data);
          setPagination(prev => ({
            ...prev,
            totalPages: Math.ceil(response.data.length / prev.itemsPerPage)
          }));
        }
      } catch (error) {
        console.error("Error fetching mountains:", error);
        setError("Failed to load mountains. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMountains();
  }, []);

  // Apply filters and pagination
  useEffect(() => {
    if (mountainsData.length === 0) return;

    let results = [...mountainsData];

    // Apply search filter
    if (searchTerm) {
      results = results.filter(mountain =>
        mountain.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply difficulty filter
    if (difficultyFilter) {
      results = results.filter(mountain => 
        mountain.difficulty === difficultyFilter
      );
    }

    // Apply pagination
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const paginatedResults = results.slice(startIndex, startIndex + pagination.itemsPerPage);

    setFilteredMountains(paginatedResults);
    setPagination(prev => ({
      ...prev,
      totalPages: Math.ceil(results.length / prev.itemsPerPage)
    }));

  }, [mountainsData, searchTerm, difficultyFilter, pagination.currentPage]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleDifficultyChange = (e) => {
    setDifficultyFilter(e.target.value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  return (
    <Layout>
      <div className="container py-5">
        {error ? (
          <div className="alert alert-danger text-center">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        ) : isLoading ? (
          <div className="text-center py-5">
            <Loading />
            <p className="mt-3">Loading mountains...</p>
          </div>
        ) : (
          <>
            <h1 className="display-5 text-center mb-5">Explore Mountains</h1>

            {/* Search and Filter Controls */}
            <div className="row mb-4">
              <div className="col-md-8 mb-3 mb-md-0">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="col-md-4">
                <select
                  value={difficultyFilter}
                  onChange={handleDifficultyChange}
                  className="form-select"
                >
                  <option value="">All Difficulties</option>
                  <option value="Extreme">Extreme</option>
                  <option value="Hard">Hard</option>
                  <option value="Moderate">Moderate</option>
                </select>
              </div>
            </div>

            {/* Mountains Grid */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {filteredMountains.length > 0 ? (
                filteredMountains.map((mountain) => (
                  <div className="col" key={mountain.id}>
                    <MountainCard 
                      mountain={{
                        ...mountain,
                        mountainCoverUrl: mountain.image,
                        status: mountain.difficulty,
                        isOpen: true
                      }} 
                    />
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5 bg-light rounded">
                  <p className="text-muted mb-0">No mountains found matching your criteria.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <nav className="mt-4">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${pagination.currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>

                  {[...Array(pagination.totalPages)].map((_, index) => (
                    <li 
                      key={index} 
                      className={`page-item ${pagination.currentPage === index + 1 ? "active" : ""}`}
                    >
                      <button 
                        className="page-link" 
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}

                  <li className={`page-item ${pagination.currentPage === pagination.totalPages ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Mountains;