import { useNavigate } from "react-router-dom"; // Import useNavigate
import Button from "../button/Button";

const MountainCard = ({ mountain }) => {
  const { id, name, image, location, elevation, difficulty, price, description } = mountain;
  const navigate = useNavigate(); // Gunakan useNavigate untuk navigasi

  // Map difficulty to Bootstrap color classes
  const difficultyColorMap = {
    easy: "success",
    moderate: "warning",
    hard: "danger",
    extreme: "dark",
  };

  const difficultyColor = difficultyColorMap[difficulty.toLowerCase()] || "secondary";

  // Handler for image error
  const handleImageError = (e) => {
    // Ganti gambar dengan div yang menampilkan "No Image Available"
    const imageContainer = e.target.parentElement;
    imageContainer.innerHTML = `
      <div 
        style="
          height: 200px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          background-color: #f0f0f0; 
          color: #666; 
          font-size: 1.2rem;
        "
      >
        No Image Available
      </div>
    `;
  };

  // Navigasi ke halaman detail gunung
  const handleViewDetails = (e) => {
    e.stopPropagation(); // Mencegah event bubbling
    navigate(`/mountain/${id}`); // Navigasi ke halaman detail gunung
  };

  return (
    <div
      className="card h-100 shadow-sm hover-effect"
      style={{
        transition: "transform 0.3s ease",
        cursor: "pointer",
      }}
      onClick={handleViewDetails} // Navigasi saat card diklik
    >
      <div className="position-relative">
        {image ? (
          <img
            src={image}
            alt={name}
            className="card-img-top"
            style={{ height: "200px", objectFit: "cover" }}
            onError={handleImageError} // Tangani error gambar
          />
        ) : (
          <div
            style={{
              height: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f0f0f0",
              color: "#666",
              fontSize: "1.2rem",
            }}
          >
            Can't Load This Image
          </div>
        )}
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
          <Button variant="primary" onClick={handleViewDetails}>
            View
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MountainCard;