import {
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
  Query,
} from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { CreateMessageDto, RoomInformation } from "./messages.types";
import { Public } from "@/utils/decorators";

@Controller("messages")
export class MessagesController {
  private readonly logger = new Logger("Message Logger");
  constructor(
    private readonly messagesService: MessagesService) {}

  @Public()
  @Post()
  async createMessage(
    @Body()
    createMessageDto: Array<CreateMessageDto>,
  ) {
    console.table(createMessageDto);
    this.logger.debug("create message");

    for(let i = 0; i < createMessageDto.length; i++) {
      const messageId = await this.messagesService.createMessage(
        createMessageDto[i],
      );
      
      if (!messageId)
        throw new InternalServerErrorException("Failed to create message");
  
      }
      return {
        status: "ok",
        statusCode: 200,
        timestamp: new Date(),
        data: createMessageDto,
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
