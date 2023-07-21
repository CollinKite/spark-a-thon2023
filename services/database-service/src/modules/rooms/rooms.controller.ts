import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Post,
  Query,
} from "@nestjs/common";
import { RoomsService } from "./rooms.service";

@Controller("rooms")
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  async createRoom(
    @Body()
    { userId }: { userId: string },
  ) {
    console.log(userId);
    const room = await this.roomsService.createRoom(userId);

    if (room)
      return {
        status: "ok",
        statusCode: 200,
        timestamp: new Date(),
        data: { roomId: room },
      };

    throw new Error("Failed to create room");
  }

  @Get()
  async getRooms(
    @Query("userId")
    userId: string,
  ) {
    const rooms = await this.roomsService.getRooms(userId);

    if (rooms.length !== 0)
      return {
        status: "ok",
        statusCode: 200,
        timestamp: new Date(),
        data: rooms,
      };

    const room = await this.roomsService.createRoom(userId);

    if (room)
      return {
        status: "ok",
        statusCode: 200,
        timestamp: new Date(),
        data: room,
      };

    throw new Error("Failed to get rooms");
  }

  @Delete("all")
  async deleteAllRooms(@Query("userId") userId: string) {
    const result = await this.roomsService.deleteAllRooms(userId);

    if (!result)
      throw new InternalServerErrorException("Failed to delete all rooms");

    return {
      status: "ok",
      statusCode: 200,
      timestamp: new Date(),
      data: "deleted all rooms",
    };
  }

  @Delete()
  async deleteRoom(
    @Body()
    roomInfo: {
      roomId: string;
      userId: string;
    },
  ) {
    const result = await this.roomsService.deleteRoom(roomInfo);

    if (!result)
      throw new InternalServerErrorException(
        `Failed to delete room ${roomInfo.roomId}`,
      );

    return {
      status: "ok",
      statusCode: 200,
      timestamp: new Date(),
      data: `deleted room ${roomInfo.roomId}`,
    };
  }
}
