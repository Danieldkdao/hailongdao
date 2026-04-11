import { parseAsInteger, parseAsStringEnum, useQueryStates } from "nuqs";
import { SORT_BY } from "../lib/params";

export const useCommentFilters = () => {
  return useQueryStates(
    {
      page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
      sortBy: parseAsStringEnum([...SORT_BY])
        .withDefault("most_recent")
        .withOptions({ clearOnDefault: true }),
    },
    { shallow: false },
  );
};
