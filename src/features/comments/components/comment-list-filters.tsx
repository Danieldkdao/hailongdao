"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCommentFilters } from "../hooks/use-comment-params";
import { SORT_BY } from "../lib/params";
import { DEFAULT_PAGE } from "@/lib/constants";

export const CommentListFilters = () => {
  const [filters, setFilters] = useCommentFilters();

  return (
    <Select
      value={filters.sortBy}
      onValueChange={(value) =>
        setFilters({
          page: DEFAULT_PAGE,
          sortBy: value as (typeof SORT_BY)[number],
        })
      }
    >
      <SelectTrigger className="capitalize">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SORT_BY.map((option) => (
          <SelectItem key={option} value={option} className="capitalize">
            {option.replaceAll("_", " ")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
