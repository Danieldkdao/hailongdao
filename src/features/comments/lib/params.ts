import { createLoader, parseAsInteger, parseAsStringEnum } from "nuqs/server";

export const SORT_BY = ["most_recent", "oldest"] as const;

export const filterSearchParams = {
  page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
  sortBy: parseAsStringEnum([...SORT_BY])
    .withDefault("most_recent")
    .withOptions({ clearOnDefault: true }),
};

export const loadSearchParams = createLoader(filterSearchParams);
