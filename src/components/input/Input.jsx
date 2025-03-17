const Input = ({
  type = "text",
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  fullWidth = false,
  className = "",
}) => {
  return (
    <div className={`mb-3 ${fullWidth ? "w-100" : ""} ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`form-control ${error ? "is-invalid" : ""}`}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  )
}

export default Input

