import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { users } from "./users";
import { rooms } from "./rooms";

export const usersToRooms = pgTable(
  "usersToRooms",
  {
    userId: text("userId").notNull(),
    roomId: text("roomId").notNull(),
  },
  (table) => ({
    primaryKey: primaryKey(table.userId, table.roomId),
  }),
);

export const usersToRoomsRelations = relations(usersToRooms, ({ one }) => ({
  user: one(users, {
    fields: [usersToRooms.userId],
    references: [users.id],
  }),
  room: one(rooms, {
    fields: [usersToRooms.roomId],
    references: [rooms.id],
  }),
}));
