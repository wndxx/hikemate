// components/modals/DeleteMountainModal.jsx
import { useState } from "react"

const DeleteMountainModal = ({
  show,
  mountain,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  if (!show || !mountain) return null

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Delete Mountain</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="d-flex align-items-center mb-3">
              {mountain.mountainCoverUrl ? (
                <img
                  src={mountain.mountainCoverUrl || "/placeholder.svg"}
                  alt={mountain.name}
                  className="img-thumbnail me-3"
                  style={{ width: "60px", height: "60px", objectFit: "cover" }}
                />
              ) : (
                <div
                  className="bg-light d-flex align-items-center justify-content-center me-3"
                  style={{ width: "60px", height: "60px" }}
                >
                  <i className="bi bi-image text-muted"></i>
                </div>
              )}
              <div>
                <h5 className="mb-1">{mountain.name}</h5>
                <p className="text-muted mb-0">{mountain.location}</p>
                <p className="text-muted mb-0">{formatPrice(mountain.price)}</p>
                <span
                  className={`badge bg-${
                    mountain.status === "SAFE"
                      ? "success"
                      : mountain.status === "OPEN"
                        ? "success"
                        : mountain.status === "WARNING"
                          ? "warning"
                          : mountain.status === "DANGEROUS"
                            ? "danger"
                            : "secondary"
                  }`}
                >
                  {mountain.status}
                </span>
              </div>
            </div>
            <p>Are you sure you want to delete this mountain? This action cannot be undone.</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteMountainModal