import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { messages } from "./messages";
import { rooms } from "./rooms";

export const users = pgTable("users", {
  id: text("id").primaryKey(),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  messages: many(messages),
  rooms: many(rooms),
}));
