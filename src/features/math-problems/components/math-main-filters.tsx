"use client";

import { useMathProblemFilters } from "../hooks/use-math-problem-params";
import { SearchInput } from "@/components/search-input";
import { DEFAULT_PAGE } from "@/lib/constants";
import { SORT_BY } from "../lib/params";
import { Button } from "@/components/ui/button";

export const MathMainFilters = () => {
  const [filters, setFilters] = useMathProblemFilters();

  return (
    <div className="w-full flex flex-col gap-4 items-center">
      <SearchInput
        value={filters.query}
        onSearchAction={(value) =>
          setFilters({ ...filters, page: DEFAULT_PAGE, query: value })
        }
        className="h-20 px-8 rounded-full text-2xl md:text-2xl font-medium"
        placeholder="Search math problems..."
      />
      <div className="flex items-center gap-4">
        <span className="font-medium">Sort By</span>
        <div className="flex items-center gap-2">
          {SORT_BY.map((option) => (
            <Button
              key={option}
              variant={filters.sortBy === option ? "default" : "outline"}
              className="capitalize rounded-full"
              onClick={() =>
                setFilters({ ...filters, page: DEFAULT_PAGE, sortBy: option })
              }
            >
              {option.replaceAll("_", " ")}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
