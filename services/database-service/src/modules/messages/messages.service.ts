import { Injectable } from "@nestjs/common";
import { Database, InjectDrizzle } from "../drizzle";
import { CreateMessageDto, GetMessagesDto } from "./messages.types";
import { messages } from "@/schemas";
import { cuid } from "@/utils/functions";

@Injectable()
export class MessagesService {
  constructor(@InjectDrizzle() private readonly db: Database) {}

  async createMessage(createMessageDto: CreateMessageDto) {
    const id = cuid();
    const createMessage = this.db
      .insert(messages)
      .values({ ...createMessageDto, id })
      .prepare("create message");

    const result = await createMessage.execute();

    return result.rowCount > 0 ? id : null;
  }

  async getMessages({ offset, limit, userId, roomId }: GetMessagesDto) {
    const getMessages = this.db.query.messages
      .findMany({
        offset,
        limit,
        where: (messages, { and, eq }) =>
          and(eq(messages.userId, userId), eq(messages.roomId, roomId)),
      })
      .prepare("get messages");

    const messages = await getMessages.execute();

    return messages ? messages : [];
  }
}
