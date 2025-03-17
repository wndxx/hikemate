const Card = ({ children, title, subtitle, className = "", onClick, hoverable = false }) => {
  return (
    <div
      className={`card h-100 ${hoverable ? "shadow-sm hover-effect" : ""} ${className}`}
      onClick={onClick}
      style={hoverable ? { cursor: "pointer", transition: "transform 0.3s ease" } : {}}
    >
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="card-title h5 mb-1">{title}</h3>}
          {subtitle && <p className="card-subtitle text-muted small">{subtitle}</p>}
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  )
}

export default Card

