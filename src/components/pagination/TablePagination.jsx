"use client"

const TablePagination = ({ pagination, onPageChange }) => {
  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${pagination.page === 1 || !pagination.hasPrevious ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1 || !pagination.hasPrevious}
            aria-label="Previous"
          >
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>

        {[...Array(pagination.totalPages)].map((_, index) => {
          // Show limited page numbers for better UI when there are many pages
          if (
            pagination.totalPages <= 7 ||
            index === 0 ||
            index === pagination.totalPages - 1 ||
            (index >= pagination.page - 2 && index <= pagination.page + 0)
          ) {
            return (
              <li key={index} className={`page-item ${pagination.page === index + 1 ? "active" : ""}`}>
                <button className="page-link" onClick={() => onPageChange(index + 1)}>
                  {index + 1}
                </button>
              </li>
            )
          } else if (
            (index === 1 && pagination.page > 3) ||
            (index === pagination.totalPages - 2 && pagination.page < pagination.totalPages - 2)
          ) {
            return (
              <li key={index} className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )
          }
          return null
        })}

        <li
          className={`page-item ${pagination.page === pagination.totalPages || !pagination.hasNext ? "disabled" : ""}`}
        >
          <button
            className="page-link"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages || !pagination.hasNext}
            aria-label="Next"
          >
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default TablePagination