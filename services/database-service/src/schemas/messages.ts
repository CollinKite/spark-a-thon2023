import { json, pgTable, text } from "drizzle-orm/pg-core";
import { users } from "./users";

export const messages = pgTable(
  "messages",
  {
    id: text("id").primaryKey().notNull(),
    messages: json("messages").$type<Array<{}>>().default([]),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => ({}),
);
