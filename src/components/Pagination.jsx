function pageWindow(current, total) {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) result.push("gap");
    result.push(page);
  });
  return result;
}

export default function Pagination({ page, totalPages, onChange, disabled }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="btn btn-ghost"
        onClick={() => onChange(page - 1)}
        disabled={disabled || page <= 1}
      >
        Previous
      </button>

      <ul className="pagination-pages">
        {pageWindow(page, totalPages).map((item, index) =>
          item === "gap" ? (
            <li key={`gap-${index}`} className="pagination-gap" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                className={item === page ? "page-btn page-btn-current" : "page-btn"}
                onClick={() => onChange(item)}
                disabled={disabled}
                aria-current={item === page ? "page" : undefined}
                aria-label={`Page ${item}`}
              >
                {item}
              </button>
            </li>
          ),
        )}
      </ul>

      <button
        type="button"
        className="btn btn-ghost"
        onClick={() => onChange(page + 1)}
        disabled={disabled || page >= totalPages}
      >
        Next
      </button>
    </nav>
  );
}

