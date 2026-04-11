import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { SORT_BY } from "../lib/params";

export const useMathProblemFilters = () => {
  return useQueryStates(
    {
      query: parseAsString
        .withDefault("")
        .withOptions({ clearOnDefault: true }),
      sortBy: parseAsStringEnum([...SORT_BY, ""])
        .withDefault("")
        .withOptions({
          clearOnDefault: true,
        }),
      page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
    },
    { shallow: false },
  );
};
