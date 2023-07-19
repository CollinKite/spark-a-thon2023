import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { rooms } from "./rooms";

export const messageBy = pgEnum("messageBy", ["user", "ai-model"]);

export const messages = pgTable("messages", {
  id: text("id").primaryKey().notNull(),
  content: text("content").notNull(),
  userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
  roomId: text("roomId").references(() => rooms.id, { onDelete: "cascade" }),
  messageBy: messageBy("messageBy").notNull().default("user"),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const messagesRelations = relations(messages, ({ one }) => ({
  user: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),
  room: one(rooms, {
    fields: [messages.roomId],
    references: [rooms.id],
  }),
}));
