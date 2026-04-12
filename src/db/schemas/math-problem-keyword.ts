import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { KeywordTable } from "./keyword";
import { relations } from "drizzle-orm";
import { MathProblemTable } from "./math-problem";

export const MathProblemKeywordTable = pgTable(
  "math_problem_keywords",
  {
    keywordId: uuid("keyword_id")
      .references(() => KeywordTable.id, { onDelete: "cascade" })
      .notNull(),
    mathProblemId: uuid("math_problem_id")
      .references(() => MathProblemTable.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.keywordId, t.mathProblemId] })],
);

export const mathProblemKeywordRelations = relations(
  MathProblemKeywordTable,
  ({ one }) => ({
    keyword: one(KeywordTable, {
      fields: [MathProblemKeywordTable.keywordId],
      references: [KeywordTable.id],
    }),
    mathProblem: one(MathProblemTable, {
      fields: [MathProblemKeywordTable.mathProblemId],
      references: [MathProblemTable.id],
    }),
  }),
);
