import { useMemo, useState } from 'react';

export const usePagination = (items, itemsPerPage = 10, initialPage = 1) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(itemsPerPage);

  const totalPages = Math.ceil(items.length / pageSize);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return items.slice(start, end);
  }, [items, currentPage, pageSize]);

  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    goToPage(currentPage + 1);
  };

  const prevPage = () => {
    goToPage(currentPage - 1);
  };

  const firstPage = () => {
    goToPage(1);
  };

  const lastPage = () => {
    goToPage(totalPages);
  };

  const changePageSize = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing size
  };

  const getPageRange = (range = 2) => {
    const start = Math.max(1, currentPage - range);
    const end = Math.min(totalPages, currentPage + range);

    let pages = [];

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return {
    currentPage,
    totalPages,
    pageSize,
    currentItems,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    changePageSize,
    getPageRange,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    totalItems: items.length,
  };
};