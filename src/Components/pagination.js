import React from "react";

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  const getPaginationNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pageNumbers;
  };

  return (
    <div className="t4s-row t4s-prs-footer t4s-has-btn-default t4s-text-center">
    <div className="t4s-pagination-wrapper t4s-w-100">
      <nav className="t4s-pagination">
        <ul className="t4s-pagination__list list-unstyled">
  
          {/* Prev Button */}
          <li>
            <button
              onClick={(e) => {
                e.preventDefault();
                currentPage > 1 && onPageChange(currentPage - 1);
              }}
              className={`t4s-pagination__item pagination__item--prev pagination__item-arrow ${
                currentPage === 1 ? 'disabled' : ''
              }`}
            >
             
              <svg
                width="6"
                height="12"
                viewBox="0 0 6 12"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                style={{ transform: "rotate(180deg)" }}
              >
                <path d="M6 6L0 11.1962L0 0.803848L6 6Z" fill="currentColor"></path>
              </svg>
            </button>
          </li>
  
          {/* Page Numbers */}
          {getPaginationNumbers().map((page, index) => (
            <li key={index}>
              {page === "..." ? (
                <span>...</span>
              ) : currentPage === page ? (
                <span className="t4s-pagination__item pagination__item--current">{page}</span>
              ) : (
                <button
                  className="t4s-pagination__item link"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(page);
                  }}
                >
                  {page}
                </button>
              )}
            </li>
          ))}
  
          {/* Next Button */}
          <li>
            <button
              onClick={(e) => {
                e.preventDefault();
                currentPage < totalPages && onPageChange(currentPage + 1);
              }}
              className={`t4s-pagination__item pagination__item--next pagination__item-arrow ${
                currentPage === totalPages ? 'disabled' : ''
              }`}
            >
              <svg width="6" height="12" viewBox="0 0 6 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6L0 11.1962L0 0.803848L6 6Z" fill="currentColor"></path>
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
  
  );
};

export default PaginationComponent;