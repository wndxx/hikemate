import React from "react"

const SuccessModal = ({ show, onClose, message = "Operation completed successfully!" }) => {
  if (!show) return null

  return (
    <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Success</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="text-center py-4">
              <div className="mb-3">
                <i className="bi bi-check-circle-fill text-success display-1"></i>
              </div>
              <h5>{message}</h5>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={onClose}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuccessModal