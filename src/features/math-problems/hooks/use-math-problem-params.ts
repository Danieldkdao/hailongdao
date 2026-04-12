import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { SORT_BY } from "../lib/params";
import {
  mathProblemDifficultyLevels,
  mathProblemProblemStatuses,
} from "@/db/schema";

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
    },
    { shallow: false },
  );
};
