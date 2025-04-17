import { useState, useEffect } from "react"
import Layout from "../components/layout/Layout"
import MountainCard from "../components/mountainCard/MountainCard"
import Loading from "../components/loading/Loading"
import { getAllMountains } from "../api/mountains"

const Mountains = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("")
  const [mountainsData, setMountainsData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalElements: 0,
  })

  // Fetch mountains data
  const fetchMountains = async (page = 1, name = "") => {
    setIsLoading(true)
    try {
      const result = await getAllMountains(page, 10, "asc", "id", name)
      if (result.success) {
        // Transform data to match MountainCard expectations
        const transformedData = result.mountains.map(mountain => ({
          ...mountain,
          mountainCoverUrl: mountain.image,
          status: mountain.difficulty, // Use difficulty as status
          isOpen: true // Default value
        }))
        
        setMountainsData(transformedData)
        setPagination({
          currentPage: result.pagination.page,
          totalPages: result.pagination.totalPages,
          totalElements: result.pagination.totalElements,
        })
      } else {
        console.error("Failed to fetch mountains:", result.message)
      }
    } catch (error) {
      console.error("Error fetching mountains:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMountains()
  }, [])

  // Debounced search
  useEffect(() => {
    if (isSearching) {
      const timer = setTimeout(() => {
        fetchMountains(1, searchTerm)
        setIsSearching(false)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [isSearching, searchTerm])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setIsSearching(true)
  }

  const handleDifficultyChange = (e) => {
    setDifficultyFilter(e.target.value)
  }

  const handlePageChange = (page) => {
    fetchMountains(page, searchTerm)
  }

  // Filter mountains based on difficulty
  const filteredMountains = mountainsData.filter((mountain) => {
    return difficultyFilter === "" || mountain.difficulty === difficultyFilter
  })

  return (
    <Layout>
      <div className="container py-5">
        {isLoading && !isSearching ? (
          <div className="text-center py-5">
            <Loading />
          </div>
        ) : (
          <>
            <h1 className="display-5 text-center mb-5">Explore Mountains</h1>

            {/* Input Search and Filter */}
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

            {isSearching ? (
              <div className="text-center py-3">
                <Loading />
              </div>
            ) : (
              <>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                  {filteredMountains.length > 0 ? (
                    filteredMountains.map((mountain) => (
                      <div className="col" key={mountain.id}>
                        <MountainCard mountain={mountain} />
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
                        <li key={index} className={`page-item ${pagination.currentPage === index + 1 ? "active" : ""}`}>
                          <button className="page-link" onClick={() => handlePageChange(index + 1)}>
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
          </>
        )}
      </div>
    </Layout>
  )
}

export default Mountains