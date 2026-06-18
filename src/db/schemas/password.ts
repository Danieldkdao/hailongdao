import { boolean, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../helpers";
import { user } from "./user";
import { relations } from "drizzle-orm";

export const PasswordTable = pgTable("passwords", {
  id,
  password: varchar("password").notNull().unique(),
  createdByUserId: text("created_by_user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  enabled: boolean("enabled").notNull().default(true),
  createdAt,
  updatedAt,
});

export const passwordRelations = relations(PasswordTable, ({ one }) => ({
  user: one(user, {
    fields: [PasswordTable.createdByUserId],
    references: [user.id],
  }),
}));
