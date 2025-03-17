import Button from "../button/Button"

const MountainCard = ({ mountain, onBookClick }) => {
  const { id, name, image, location, elevation, difficulty, price, description } = mountain

  // Map difficulty to Bootstrap color classes
  const difficultyColorMap = {
    easy: "success",
    moderate: "warning",
    hard: "danger",
    extreme: "dark",
  }

  const difficultyColor = difficultyColorMap[difficulty.toLowerCase()] || "secondary"

  // Handler for booking
  const handleBooking = (e) => {
    // Prevent event bubbling if clicked on button
    if (e.target.tagName === "BUTTON") return

    onBookClick(id)
  }

  return (
    <div
      className="card h-100 shadow-sm hover-effect"
      style={{
        transition: "transform 0.3s ease",
        cursor: "pointer",
      }}
      onClick={handleBooking}
    >
      <div className="position-relative">
        <img
          src={image || "https://via.placeholder.com/300x200?text=Mountain"}
          alt={name}
          className="card-img-top"
          style={{ height: "200px", objectFit: "cover" }}
          onClick={() => onBookClick(id)}
        />
        <span className={`position-absolute top-0 end-0 m-2 badge bg-${difficultyColor}`}>{difficulty}</span>
      </div>

      <div className="card-body d-flex flex-column">
        <h3 className="card-title h5">{name}</h3>
        <p className="card-text text-muted small mb-1">{location}</p>
        <p className="card-text small mb-2">
          <strong>{elevation} meters</strong>
        </p>
        <p className="card-text flex-grow-1">{description}</p>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            <span className="h5 mb-0">${price}</span>
            <small className="text-muted d-block">per person</small>
          </div>
          <Button
            variant="primary"
            onClick={(e) => {
              e.stopPropagation() // Prevent card click event
              onBookClick(id)
            }}
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MountainCard

