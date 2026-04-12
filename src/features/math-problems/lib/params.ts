import {
  mathProblemDifficultyLevels,
  mathProblemProblemStatuses,
} from "@/db/schema";
import {
  createLoader,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  parseAsArrayOf,
  parseAsNumberLiteral,
} from "nuqs/server";

export const SORT_BY = [
  "most_recent",
  "most_popular",
  "most_comments",
  "most_liked",
  "oldest",
] as const;

export const filterSearchParams = {
  query: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  sortBy: parseAsStringEnum([...SORT_BY, ""])
    .withDefault("")
    .withOptions({
      clearOnDefault: true,
    }),
  difficultyLevels: parseAsArrayOf(
    parseAsNumberLiteral([...mathProblemDifficultyLevels]),
  )
    .withDefault([])
    .withOptions({ clearOnDefault: true }),
  problemStatuses: parseAsArrayOf(
    parseAsStringEnum([...mathProblemProblemStatuses]),
  )
    .withDefault([])
    .withOptions({ clearOnDefault: true }),
  page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
};

export const loadSearchParams = createLoader(filterSearchParams);
