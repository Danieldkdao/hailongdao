import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { user } from "./user";
import { CommentTable } from "./comment";
import { voteTypeEnum } from "./math-problem-vote";
import { createdAt, updatedAt } from "../helpers";
import { relations } from "drizzle-orm";

export const CommentVoteTable = pgTable("comment_votes", {
  userId: varchar("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  commentId: uuid("comment_id")
    .references(() => CommentTable.id, { onDelete: "cascade" })
    .notNull(),
  type: voteTypeEnum("type").notNull(),
  createdAt,
  updatedAt,
});

export const commentVoteRelations = relations(CommentVoteTable, ({ one }) => ({
  user: one(user, {
    fields: [CommentVoteTable.userId],
    references: [user.id],
  }),
  comment: one(CommentTable, {
    fields: [CommentVoteTable.commentId],
    references: [CommentTable.id],
  }),
}));
