import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Query,
} from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { CreateMessageDto, RoomInformation } from "./messages.types";

@Controller("messages")
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async createMessage(
    @Body()
    createMessageDto: CreateMessageDto,
  ) {
    const messageId = await this.messagesService.createMessage(
      createMessageDto,
    );

    if (!messageId)
      throw new InternalServerErrorException("Failed to create message");

    return {
      status: "ok",
      statusCode: 200,
      timestamp: new Date(),
      data: messageId,
    };
  }

  @Post()
  async getMessages(
    @Query("offset")
    offset: number,
    @Query("limit")
    limit: number,
    @Body()
    roomInformation: RoomInformation,
  ) {
    const result = await this.messagesService.getMessages({
      offset,
      limit,
      ...roomInformation,
    });

    if (result.length !== 0) {
      return {
        status: "ok",
        statusCode: 200,
        timestamp: new Date(),
        data: result,
      };
    }

    throw new InternalServerErrorException("Failed to get messages");
  }
}
