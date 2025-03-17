const Form = ({ children, onSubmit, className = "" }) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(e)
    }
  }

  return (
    <form className={`${className}`} onSubmit={handleSubmit}>
      {children}
    </form>
  )
}

export default Form

