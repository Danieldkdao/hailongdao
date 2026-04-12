import { relations } from "drizzle-orm";
import { pgTable, varchar } from "drizzle-orm/pg-core";
import { createdAt, id } from "../helpers";
import { MathProblemKeywordTable } from "./math-problem-keyword";

export const KeywordTable = pgTable("keywords", {
  id,
  keyword: varchar("keyword").notNull().unique(),
  createdAt,
});

export const keywordRelations = relations(KeywordTable, ({ many }) => ({
  mathProblems: many(MathProblemKeywordTable),
}));
