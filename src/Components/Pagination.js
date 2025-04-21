import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
    // Memoize pagination numbers calculation
    const paginationNumbers = useMemo(() => {
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
    }, [currentPage, totalPages]);

    if (totalItems <= itemsPerPage) {
        return null;
    }

    return (
        <div className="pagination">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="pagination-button"
            >
                Prev
            </button>

            {paginationNumbers.map((page, index) => (
                <button
                    key={index}
                    onClick={() => typeof page === "number" && onPageChange(page)}
                    className={`pagination-button ${currentPage === page ? "active" : ""}`}
                    disabled={page === "..."}
                >
                    {page}
                </button>
            ))}

            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="pagination-button"
            >
                Next
            </button>
        </div>
    );
};

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    totalItems: PropTypes.number.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired
};

export default Pagination; 