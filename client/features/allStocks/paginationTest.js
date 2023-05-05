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
      <ul className="pagination">
        <li className={`page-item${canGoBack ? "" : " disabled"}`}>
          <button className="page-link" onClick={handlePreviousPage}>
            &laquo;
          </button>
        </li>
        <li className="page-item active">
          <span className="page-link">{currentPage}</span>
        </li>
        <li className={`page-item${canGoForward ? "" : " disabled"}`}>
          <button className="page-link" onClick={handleNextPage}>
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
}
