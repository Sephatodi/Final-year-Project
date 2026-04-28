import PropTypes from 'prop-types';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  showPrevNext = true,
  size = 'md',
  className = '' 
}) => {
  const range = (start, end) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const getPageNumbers = () => {
    const totalNumbers = siblingCount * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages <= totalBlocks) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);
      return [...leftRange, '...', totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [1, '...', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [1, '...', ...middleRange, '...', totalPages];
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  const buttonSize = sizeClasses[size];

  const pageNumbers = getPageNumbers();

  return (
    <nav className={`flex items-center justify-center gap-1 ${className}`}>
      {/* First Page */}
      {showFirstLast && (
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={`${buttonSize} flex items-center justify-center rounded-lg border border-sage-200 dark:border-sage-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sage-50 dark:hover:bg-sage-800 transition-colors`}
          aria-label="First page"
        >
          <span className="material-icons-outlined text-sm">first_page</span>
        </button>
      )}

      {/* Previous Page */}
      {showPrevNext && (
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${buttonSize} flex items-center justify-center rounded-lg border border-sage-200 dark:border-sage-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sage-50 dark:hover:bg-sage-800 transition-colors`}
          aria-label="Previous page"
        >
          <span className="material-icons-outlined text-sm">chevron_left</span>
        </button>
      )}

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => (
        page === '...' ? (
          <span
            key={`dots-${index}`}
            className={`${buttonSize} flex items-center justify-center text-sage-500`}
          >
            ⋯
          </span>
        ) : (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`${buttonSize} flex items-center justify-center rounded-lg font-medium transition-colors ${
              currentPage === page
                ? 'bg-primary text-white'
                : 'border border-sage-200 dark:border-sage-800 hover:bg-sage-50 dark:hover:bg-sage-800'
            }`}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        )
      ))}

      {/* Next Page */}
      {showPrevNext && (
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${buttonSize} flex items-center justify-center rounded-lg border border-sage-200 dark:border-sage-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sage-50 dark:hover:bg-sage-800 transition-colors`}
          aria-label="Next page"
        >
          <span className="material-icons-outlined text-sm">chevron_right</span>
        </button>
      )}

      {/* Last Page */}
      {showFirstLast && (
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`${buttonSize} flex items-center justify-center rounded-lg border border-sage-200 dark:border-sage-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sage-50 dark:hover:bg-sage-800 transition-colors`}
          aria-label="Last page"
        >
          <span className="material-icons-outlined text-sm">last_page</span>
        </button>
      )}
    </nav>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  siblingCount: PropTypes.number,
  showFirstLast: PropTypes.bool,
  showPrevNext: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default Pagination;