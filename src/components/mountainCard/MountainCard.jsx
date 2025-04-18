"use client"

import { useNavigate } from "react-router-dom"
import Button from "../button/Button"

const MountainCard = ({ mountain }) => {
  const { 
    id, 
    name, 
    image: mountainCoverUrl, // Ubah dari mountainCoverUrl ke image (sesuai mock data)
    location, 
    difficulty: status = "OPEN", // Gunakan difficulty sebagai status default
    price, 
    description, 
    elevation // Tambahkan elevation dari mock data
  } = mountain

  const navigate = useNavigate()

  // Map status/difficulty to color classes
  const statusColorMap = {
    SAFE: "success",
    OPEN: "success",
    WARNING: "warning",
    DANGEROUS: "danger",
    CLOSED: "dark",
    Extreme: "danger",
    Hard: "warning",
    Moderate: "success"
  }

  const statusColor = statusColorMap[status] || "secondary"

  const handleImageError = (e) => {
    const imageContainer = e.target.parentElement
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
    `
  }

  const handleViewDetails = (e) => {
    e.stopPropagation()
    navigate(`/mountain/${id}`)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div
      className="card h-100 shadow-sm hover-effect"
      style={{
        transition: "transform 0.3s ease",
        cursor: "pointer",
      }}
      onClick={handleViewDetails}
    >
      <div className="position-relative">
        {mountainCoverUrl ? (
          <img
            src={mountainCoverUrl}
            alt={name}
            className="card-img-top"
            style={{ height: "200px", objectFit: "cover" }}
            onError={handleImageError}
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
            Tidak ada gambar tersedia
          </div>
        )}
        <span className={`position-absolute top-0 end-0 m-2 badge bg-${statusColor}`}>
          {status}
        </span>
      </div>

      <div className="card-body d-flex flex-column">
        <h3 className="card-title h5">{name}</h3>
        <p className="card-text text-muted small mb-1">{location}</p>
        <p className="card-text small mb-2">
          <strong>Tinggi: </strong>
          {elevation} mdpl
        </p>
        <p className="card-text small mb-2">
          <strong>Kesulitan: </strong>
          <span className={`text-${statusColor}`}>{status}</span>
        </p>
        <p className="card-text flex-grow-1">
          {description && description.length > 100 ? 
            `${description.substring(0, 100)}...` : description}
        </p>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            <span className="h5 mb-0">{formatPrice(price)}</span>
            <small className="text-muted d-block">per orang</small>
          </div>
          <Button variant="primary" onClick={handleViewDetails}>
            Lihat
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MountainCard