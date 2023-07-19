import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { messages } from "./messages";

export const rooms = pgTable("rooms", {
  id: text("id").primaryKey(),

  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const roomsRelations = relations(rooms, ({ many, one }) => ({
  user: one(users, {
    fields: [rooms.userId],
    references: [users.id],
  }),
  messages: many(messages),
}));
