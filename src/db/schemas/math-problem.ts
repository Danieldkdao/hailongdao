import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../helpers";
import { user } from "./user";
import { CommentTable } from "./comment";
import { MathProblemVoteTable } from "./math-problem-vote";

export const mathProblemStatuses = ["draft", "published", "archived"] as const;
export type MathProblemStatus = (typeof mathProblemStatuses)[number];
export const mathProblemStatusEnum = pgEnum(
  "math_problem_statuses",
  mathProblemStatuses,
);

export const MathProblemTable = pgTable("math_problems", {
  id,
  title: varchar("title").notNull(),
  userId: varchar("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  content: text("text").notNull(),
  status: mathProblemStatusEnum("status").notNull(),
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
  }),
);
