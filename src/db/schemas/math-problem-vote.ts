import {
  pgEnum,
  pgTable,
  primaryKey,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./user";
import { MathProblemTable } from "./math-problem";
import { createdAt, updatedAt } from "../helpers";
import { relations } from "drizzle-orm";

export const voteTypes = ["up", "down"] as const;
export type VoteType = (typeof voteTypes)[number];
export const voteTypeEnum = pgEnum("vote_types", voteTypes);

export const MathProblemVoteTable = pgTable(
  "math_problem_votes",
  {
    userId: varchar("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    mathProblemId: uuid("math_problem_id")
      .references(() => MathProblemTable.id, { onDelete: "cascade" })
      .notNull(),
    type: voteTypeEnum("type").notNull(),
    createdAt,
    updatedAt,
  },
  (t) => [primaryKey({ columns: [t.userId, t.mathProblemId] })],
);

export const mathProblemVoteRelations = relations(
  MathProblemVoteTable,
  ({ one }) => ({
    user: one(user, {
      fields: [MathProblemVoteTable.userId],
      references: [user.id],
    }),
    mathProblem: one(MathProblemTable, {
      fields: [MathProblemVoteTable.mathProblemId],
      references: [MathProblemTable.id],
    }),
  }),
);
