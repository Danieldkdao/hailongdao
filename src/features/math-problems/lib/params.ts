import {
  createLoader,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
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
  page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
};

export const loadSearchParams = createLoader(filterSearchParams);
