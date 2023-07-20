import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import { AtGuard } from "../auth";

@Controller("rooms")
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @UseGuards(AtGuard)
  async createRoom(
    @Body()
    userId: string,
  ) {
    const room = await this.roomsService.createRoom(userId);

    if (room)
      return {
        status: "ok",
        statusCode: 200,
        timestamp: new Date(),
        data: room,
      };

    throw new Error("Failed to create room");
  }

  @Get()
  @UseGuards(AtGuard)
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
  @UseGuards(AtGuard)
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
}
