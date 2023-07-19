import { Injectable } from "@nestjs/common";
import { and, eq, gte } from "drizzle-orm";
import { messages, rooms } from "@/schemas";
import { cuid } from "@/utils/functions";
import { type Database, InjectDrizzle } from "../drizzle";

@Injectable()
export class RoomsService {
  private static readonly MAX_MESSAGES = 30;

  constructor(
    @InjectDrizzle()
    private readonly db: Database,
  ) {}

  async createRoom(userId: string) {
    const id = cuid();

    const createRoom = this.db
      .insert(rooms)
      .values({
        id,
        userId,
      })
      .prepare("create room");

    await createRoom.execute();

    return id;
  }

  async getRooms(userId: string) {
    const getRooms = this.db.query.rooms
      .findMany({
        with: {
          messages: {
            limit: RoomsService.MAX_MESSAGES,
            where: gte(messages.createdAt, new Date()),
          },
        },
        where: (rooms, { eq }) => eq(rooms.userId, userId),
      })
      .prepare("get rooms");

    const rooms = await getRooms.execute();

    return rooms ? rooms : [];
  }

  async deleteAllRooms(userId: string) {
    const deleteRooms = this.db
      .delete(rooms)
      .where(eq(rooms.userId, userId))
      .prepare("delete all rooms");

    const result = await deleteRooms.execute();

    return result.rowCount > 0 ? true : false;
  }

  async deleteRoom({ roomId, userId }: { roomId: string; userId: string }) {
    const deleteRoom = this.db
      .delete(rooms)
      .where(and(eq(rooms.id, roomId), eq(rooms.userId, userId)))
      .prepare("delete room");

    const result = await deleteRoom.execute();

    return result.rowCount > 0 ? true : false;
  }
}
