import React from "react";

export default function Pagination({ totalPages, currentPage, onPageChange }) {
  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < totalPages;

  const handlePreviousPage = () => {
    if (canGoBack) onPageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    if (canGoForward) onPageChange(currentPage + 1);
  };

  return (
    <nav>
      <div className="pagination">
        <button
          className={`page-link${canGoBack ? "" : " disabled"}`}
          onClick={handlePreviousPage}
        >
          Prev
        </button>
        <span className="page-link current-page">Page: {currentPage}</span>
        <button
          className={`page-link${canGoForward ? "" : " disabled"}`}
          onClick={handleNextPage}
        >
          Next
        </button>
      </div>
    </nav>
  );
}
