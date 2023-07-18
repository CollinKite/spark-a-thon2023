import { pgTable, text } from "drizzle-orm/pg-core";
import { users } from "./users";

export const messages = pgTable(
  "messages",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => ({}),
);
