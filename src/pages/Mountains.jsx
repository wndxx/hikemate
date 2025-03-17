import { useState } from "react"
import Layout from "../components/layout/Layout"
import MountainCard from "../components/mountainCard/MountainCard"

// Sample data - in a real app, this would come from an API
const mountainsData = [
  {
    id: 1,
    name: "Mount Everest",
    image:
      "https://images.unsplash.com/photo-1575728252059-db43d03fc2de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bW91bnRhaW4lMjBwZWFrfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    location: "Nepal/Tibet",
    elevation: 8848,
    difficulty: "Extreme",
    price: 12000,
    description: "The highest mountain on Earth, located in the Mahalangur Himal sub-range of the Himalayas.",
  },
  {
    id: 2,
    name: "K2",
    image:
      "https://images.unsplash.com/photo-1623966849439-9b16e9bf8c2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8azIlMjBtb3VudGFpbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    location: "Pakistan/China",
    elevation: 8611,
    difficulty: "Extreme",
    price: 15000,
    description: "The second-highest mountain on Earth, known for its extreme difficulty and danger.",
  },
  {
    id: 3,
    name: "Mount Kilimanjaro",
    image:
      "https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bW91bnQlMjBraWxpbWFuamFyb3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    location: "Tanzania",
    elevation: 5895,
    difficulty: "Moderate",
    price: 4000,
    description: "The highest mountain in Africa and the highest single free-standing mountain in the world.",
  },
  {
    id: 4,
    name: "Matterhorn",
    image:
      "https://images.unsplash.com/photo-1565108160850-4a8669f98b8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWF0dGVyaG9ybnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    location: "Switzerland/Italy",
    elevation: 4478,
    difficulty: "Hard",
    price: 6000,
    description: "One of the most famous mountains in the Alps, known for its distinctive pyramid shape.",
  },
  {
    id: 5,
    name: "Mount Fuji",
    image:
      "https://images.unsplash.com/photo-1570459027562-4a916cc6113f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW91bnQlMjBmdWppfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    location: "Japan",
    elevation: 3776,
    difficulty: "Moderate",
    price: 2500,
    description: "The highest mountain in Japan and an active volcano, known for its perfectly symmetrical cone.",
  },
  {
    id: 6,
    name: "Denali",
    image:
      "https://images.unsplash.com/photo-1535581652167-3a26c90a9910?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGVuYWxpfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    location: "Alaska, USA",
    elevation: 6190,
    difficulty: "Hard",
    price: 8000,
    description: "The highest mountain peak in North America, located in Alaska's Denali National Park.",
  },
]

const Mountains = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("")

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleDifficultyChange = (e) => {
    setDifficultyFilter(e.target.value)
  }

  const handleBookClick = (mountainId) => {
    alert(`Booking mountain with ID: ${mountainId}`)
    // In a real app, this would navigate to a booking page or open a modal
  }

  // Filter mountains based on search term and difficulty
  const filteredMountains = mountainsData.filter((mountain) => {
    const matchesSearch =
      mountain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mountain.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDifficulty =
      difficultyFilter === "" || mountain.difficulty.toLowerCase() === difficultyFilter.toLowerCase()

    return matchesSearch && matchesDifficulty
  })

  return (
    <Layout>
      <div className="container py-5">
        <h1 className="display-5 text-center mb-5">Explore Mountains</h1>

        <div className="row mb-4">
          <div className="col-md-8 mb-3 mb-md-0">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or location"
              value={searchTerm}
              onChange={handleSearchChange}
            />
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

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredMountains.length > 0 ? (
            filteredMountains.map((mountain) => (
              <div className="col" key={mountain.id}>
                <MountainCard mountain={mountain} onBookClick={handleBookClick} />
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5 bg-light rounded">
              <p className="text-muted mb-0">No mountains found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Mountains

