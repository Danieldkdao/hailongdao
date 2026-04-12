import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../helpers";
import { user } from "./user";
import { CommentTable } from "./comment";
import { MathProblemVoteTable } from "./math-problem-vote";
import { MathProblemKeywordTable } from "./math-problem-keyword";

export const mathProblemStatuses = ["draft", "published", "archived"] as const;
export type MathProblemStatus = (typeof mathProblemStatuses)[number];
export const mathProblemStatusEnum = pgEnum(
  "math_problem_statuses",
  mathProblemStatuses,
);

export const mathProblemProblemStatuses = ["open", "solved"] as const;
export type MathProblemProblemStatus =
  (typeof mathProblemProblemStatuses)[number];
export const mathProblemProblemStatusEnum = pgEnum(
  "math_problem_problem_statuses",
  mathProblemProblemStatuses,
);

export const mathProblemDifficultyLevels = [1, 2, 3, 4, 5] as const;
export type MathProblemDifficultyLevel =
  (typeof mathProblemDifficultyLevels)[number];

export const MathProblemTable = pgTable("math_problems", {
  id,
  title: varchar("title").notNull(),
  userId: varchar("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  content: text("text").notNull(),
  status: mathProblemStatusEnum("status").notNull(),
  problemStatus: mathProblemProblemStatusEnum("problem_status").notNull(),
  views: integer("views").notNull().default(0),
  difficultyLevel: integer("difficulty_level")
    .$type<MathProblemDifficultyLevel>()
    .notNull(),
  createdAt,
  updatedAt,
});

export const mathProblemRelations = relations(
  MathProblemTable,
  ({ one, many }) => ({
    user: one(user, {
      fields: [MathProblemTable.userId],
      references: [user.id],
    }),
    comments: many(CommentTable),
    votes: many(MathProblemVoteTable),
    keywords: many(MathProblemKeywordTable),
  }),
);
