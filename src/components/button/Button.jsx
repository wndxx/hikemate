"use client"

const Button = ({
  children,
  type = "button",
  onClick,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  className = "",
}) => {
  // Map our size values to Bootstrap sizes
  const sizeMap = {
    sm: "btn-sm",
    md: "",
    lg: "btn-lg",
  }

  const btnSize = sizeMap[size] || ""

  return (
    <button
      type={type}
      className={`btn btn-${variant} ${btnSize} ${fullWidth ? "w-100" : ""} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button

