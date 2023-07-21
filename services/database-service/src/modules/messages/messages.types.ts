import { InferModel } from "drizzle-orm";
import { messages } from "@/schemas";

export type CreateMessageDto = Omit<
  InferModel<typeof messages, "insert">,
  "id"
>;
export type Message = InferModel<typeof messages, "select">;

export type GetMessagesDto = {
  userId: string;
  roomId: string;
  limit: number;
  offset: number;
};

export type RoomInformation = {
  roomId: string;
  userId: string;
};
