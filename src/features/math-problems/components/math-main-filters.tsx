"use client";

import { useMathProblemFilters } from "../hooks/use-math-problem-params";
import { SearchInput } from "@/components/search-input";
import { DEFAULT_PAGE } from "@/lib/constants";
import { SORT_BY } from "../lib/params";
import { Button } from "@/components/ui/button";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import {
  MathProblemDifficultyLevel,
  mathProblemDifficultyLevels,
  MathProblemProblemStatus,
  mathProblemProblemStatuses,
} from "@/db/schema";
import { DifficultyStars } from "@/components/difficulty-stars";
import { getMathProblemProblemStatus } from "./formatters";

export const MathMainFilters = () => {
  const [filters, setFilters] = useMathProblemFilters();
  const hasActiveFilters =
    filters.query.trim() ||
    filters.problemStatuses.length ||
    filters.difficultyLevels.length ||
    filters.sortBy;

  return (
    <div className="w-full flex flex-col gap-4 items-center">
      <SearchInput
        value={filters.query}
        onSearchAction={(value) =>
          setFilters({ ...filters, page: DEFAULT_PAGE, query: value })
        }
        className="h-20 px-8 max-w-300 rounded-full text-2xl md:text-2xl font-medium"
        placeholder="Search math problems..."
      />

      <div className="flex items-center justify-center gap-2 flex-wrap">
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
        <MultiSelect
          values={filters.difficultyLevels.map((l) => l.toString())}
          onValuesChange={(values) =>
            setFilters({
              ...filters,
              page: DEFAULT_PAGE,
              difficultyLevels: values.map(
                (v) => Number(v) as MathProblemDifficultyLevel,
              ),
            })
          }
        >
          <MultiSelectTrigger>
            <MultiSelectValue
              placeholder="Filter by difficulty level..."
              overflowBehavior="wrap"
            />
          </MultiSelectTrigger>
          <MultiSelectContent>
            {mathProblemDifficultyLevels.map((level) => (
              <MultiSelectItem
                key={level}
                value={level.toString()}
                className="flex items-center gap-2"
              >
                <DifficultyStars difficultyLevel={level} className="size-4" />
                <span>
                  {level} / {mathProblemDifficultyLevels.length}
                </span>
              </MultiSelectItem>
            ))}
          </MultiSelectContent>
        </MultiSelect>
        <MultiSelect
          values={filters.problemStatuses}
          onValuesChange={(values) =>
            setFilters({
              ...filters,
              page: DEFAULT_PAGE,
              problemStatuses: values.map((v) => v as MathProblemProblemStatus),
            })
          }
        >
          <MultiSelectTrigger>
            <MultiSelectValue
              placeholder="Filter by math problem status..."
              overflowBehavior="cutoff"
            />
          </MultiSelectTrigger>
          <MultiSelectContent>
            {mathProblemProblemStatuses.map((status) => (
              <MultiSelectItem key={status} value={status}>
                {getMathProblemProblemStatus(status)}
              </MultiSelectItem>
            ))}
          </MultiSelectContent>
        </MultiSelect>
        {hasActiveFilters && (
          <Button
            onClick={() =>
              setFilters({
                page: DEFAULT_PAGE,
                difficultyLevels: [],
                problemStatuses: [],
                query: "",
                sortBy: "",
              })
            }
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};
