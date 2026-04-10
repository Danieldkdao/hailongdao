import { AnyPgColumn, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../helpers";
import { user } from "./user";
import { MathProblemTable } from "./math-problem";
import { relations } from "drizzle-orm";
import { CommentVoteTable } from "./comment-vote";

export const CommentTable = pgTable("comments", {
  id,
  parentId: uuid("parent_id").references((): AnyPgColumn => CommentTable.id, {
    onDelete: "cascade",
  }),
  userId: varchar("user_id").references(() => user.id, { onDelete: "cascade" }),
  mathProblemId: uuid("math_problem_id")
    .references(() => MathProblemTable.id, { onDelete: "cascade" })
    .notNull(),
  content: text("content").notNull(),
  createdAt,
  updatedAt,
});

export const commentRelations = relations(CommentTable, ({ one, many }) => ({
  parent: one(CommentTable, {
    fields: [CommentTable.parentId],
    references: [CommentTable.id],
    relationName: "comment_replies",
  }),
  children: many(CommentTable, {
    relationName: "comment_replies",
  }),
  user: one(user, {
    fields: [CommentTable.userId],
    references: [user.id],
  }),
  mathProblem: one(MathProblemTable, {
    fields: [CommentTable.mathProblemId],
    references: [MathProblemTable.id],
  }),
  votes: many(CommentVoteTable),
}));
