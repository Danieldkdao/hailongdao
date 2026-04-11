import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "./ui/button";

type PaginationProps = {
  hasPrevPage: boolean;
  hasNextPage: boolean;
  totalPages: number;
  currentPage: number;
  handlePagination: (dir: "next" | "prev") => void;
};

export const Pagination = ({
  hasNextPage,
  hasPrevPage,
  totalPages,
  currentPage,
  handlePagination,
}: PaginationProps) => {
  return (
    <div className="w-full flex items-center justify-between gap-4 flex-wrap">
      <span>
        {currentPage} of {totalPages || 1}{" "}
        {(totalPages || 1) > 1 ? "pages" : "page"}
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePagination("prev")}
          disabled={!hasPrevPage}
        >
          <ArrowLeftIcon />
          Prev
        </Button>
        <Button
          size="sm"
          onClick={() => handlePagination("next")}
          disabled={!hasNextPage}
        >
          <ArrowRightIcon />
          Next
        </Button>
      </div>
    </div>
  );
};
