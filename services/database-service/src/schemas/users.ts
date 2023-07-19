import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { messages } from "./messages";
import { rooms } from "./rooms";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
});

export const userRelations = relations(users, ({ one, many }) => ({
  messages: many(messages),
  rooms: many(rooms),
}));
