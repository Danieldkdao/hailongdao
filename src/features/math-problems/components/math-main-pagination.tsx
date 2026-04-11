"use client";

import { Pagination } from "@/components/pagination";
import { GetMathProblemsType } from "../actions/actions";
import { useMathProblemFilters } from "../hooks/use-math-problem-params";

export const MathMainPagination = ({
  metadata,
}: {
  metadata: GetMathProblemsType["metadata"];
}) => {
  const [filters, setFilters] = useMathProblemFilters();

  const handlePagination = (dir: "prev" | "next") => {
    if (dir === "prev" && metadata.hasPrevPage) {
      setFilters({ ...filters, page: filters.page - 1 });
    }
    if (dir === "next" && metadata.hasNextPage) {
      setFilters({ ...filters, page: filters.page + 1 });
    }
  };

  return (
    <Pagination
      {...metadata}
      currentPage={filters.page}
      handlePagination={handlePagination}
    />
  );
};
