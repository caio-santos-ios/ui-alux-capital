type TProps = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  totalData: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({currentPage, totalData, totalPages, totalCount, onPageChange}: TProps) => {

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 3) {
      return Array.from({length: totalPages}, (_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 2) pages.push("...");

    if (currentPage !== 1 && currentPage !== totalPages) {
      pages.push(currentPage);
    }

    if (currentPage < totalPages - 1) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex flex-col items-center md:flex-row md:justify-between">
      <h4 className="text-gray-700 dark:text-gray-400">
        Mostrando {totalData} de {totalCount}
      </h4>

      <div className="flex items-center">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="mr-2 flex items-center h-10 justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 text-sm"
        >
          Anterior
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-500 dark:text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`flex w-10 h-10 items-center justify-center rounded-lg text-sm font-medium hover:bg-blue-500/8 hover:text-brand-500 dark:hover:text-brand-500
                  ${currentPage === page
                    ? "bg-brand-500 text-white"
                    : "text-gray-700 dark:text-gray-400"
                  }`}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-2 flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs text-sm hover:bg-gray-50 h-10 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3"
        >
          Próximo
        </button>
      </div>
    </div>
  );
};

export default Pagination;
