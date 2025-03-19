import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useSelector

const MountainModal = ({ mountain, onClose, onBookClick }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth); // Ambil status autentikasi

  const handleBookNow = () => {
    if (!isAuthenticated) {
      alert("Anda harus login terlebih dahulu untuk melakukan booking.");
      navigate("/login");
    } else {
      navigate(`/transaction/${mountain.id}`);
    }
  };

  return (
    <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content" style={{ height: "90vh" }}>
          <div className="modal-header">
            <h5 className="modal-title">{mountain.name}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body" style={{ overflowY: "auto" }}>
            <img src={mountain.image} alt={mountain.name} className="img-fluid mb-3" />
            <p>
              <strong>Location:</strong> {mountain.location}
            </p>
            <p>
              <strong>Elevation:</strong> {mountain.elevation} meters
            </p>
            <p>
              <strong>Difficulty:</strong> {mountain.difficulty}
            </p>
            <p>
              <strong>Price:</strong> ${mountain.price} per person
            </p>
            <p>
              <strong>Description:</strong> {mountain.description}
            </p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={handleBookNow}>
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MountainModal;