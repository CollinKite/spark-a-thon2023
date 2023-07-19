import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
  },
  (table) => ({}),
);

export const userRelations = relations(users, ({ one, many }) => ({}));
