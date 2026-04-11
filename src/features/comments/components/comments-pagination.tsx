"use client";

import { Pagination } from "@/components/pagination";
import { GetCommentsType } from "../actions/actions";
import { useCommentFilters } from "../hooks/use-comment-params";

export const CommentsPagination = ({
  metadata,
}: {
  metadata: GetCommentsType["metadata"];
}) => {
  const [filters, setFilters] = useCommentFilters();

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
      handlePagination={handlePagination}
      currentPage={filters.page}
    />
  );
};
