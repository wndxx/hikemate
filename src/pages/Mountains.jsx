import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import MountainCard from "../components/mountainCard/MountainCard";
import MountainModal from "./MountainPage";
import Loading from "../components/loading/Loading";

const Mountains = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [selectedMountain, setSelectedMountain] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mountainsData, setMountainsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Ambil data gunung dari db.json
  useEffect(() => {
    fetch("/db.json")
      .then((response) => response.json())
      .then((data) => {
        setMountainsData(data.mountains);
        setIsLoading(false); // Data selesai dimuat, hentikan loading
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Hentikan loading meskipun ada error
      });
  }, []);

  const handleCardClick = (mountain) => {
    setSelectedMountain(mountain);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMountain(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setIsSearching(true); // Mulai loading
    setTimeout(() => {
      setIsSearching(false); // Hentikan loading setelah simulasi delay
    }, 500); // Simulasikan delay 500ms
  };

  const handleDifficultyChange = (e) => {
    setDifficultyFilter(e.target.value);
    setIsSearching(true); // Mulai loading
    setTimeout(() => {
      setIsSearching(false); // Hentikan loading setelah simulasi delay
    }, 500); // Simulasikan delay 500ms
  };

  const handleBookClick = (mountainId) => {
    alert(`Booking mountain with ID: ${mountainId}`);
    // Di aplikasi nyata, ini akan mengarahkan ke halaman booking atau membuka modal
  };

  // Filter gunung berdasarkan search term dan difficulty
  const filteredMountains = mountainsData.filter((mountain) => {
    const matchesSearch = mountain.name.toLowerCase().includes(searchTerm.toLowerCase()) || mountain.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDifficulty = difficultyFilter === "" || mountain.difficulty.toLowerCase() === difficultyFilter.toLowerCase();

    return matchesSearch && matchesDifficulty;
  });

  return (
    <Layout>
      <div className="container py-5">
        {isLoading ? (
          <Loading /> // Tampilkan loading saat data sedang dimuat
        ) : (
          <>
            <h1 className="display-5 text-center mb-5">Explore Mountains</h1>

            {/* Input Search dan Filter */}
            <div className="row mb-4">
              <div className="col-md-8 mb-3 mb-md-0">
                <input type="text" className="form-control" placeholder="Search by name or location" value={searchTerm} onChange={handleSearchChange} />
              </div>

              <div className="col-md-4">
                <select value={difficultyFilter} onChange={handleDifficultyChange} className="form-select">
                  <option value="">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="hard">Hard</option>
                  <option value="extreme">Extreme</option>
                </select>
              </div>
            </div>

            {isSearching ? (
              <Loading /> 
            ) : (
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {filteredMountains.length > 0 ? (
                  filteredMountains.map((mountain) => (
                    <div className="col" key={mountain.id}>
                      <MountainCard mountain={mountain} onBookClick={handleCardClick} />
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center py-5 bg-light rounded">
                    <p className="text-muted mb-0">No mountains found matching your criteria.</p>
                  </div>
                )}
              </div>
            )}

            {/* Modal */}
            {isModalOpen && <MountainModal mountain={selectedMountain} onClose={handleCloseModal} onBookClick={handleBookClick} />}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Mountains;
