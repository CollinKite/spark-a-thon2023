import { Body, Controller, Inject, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { RoomsService } from "../rooms/rooms.service";

@Controller("users")
export class UsersController {
  constructor(
    @Inject(RoomsService)
    private readonly roomsService: RoomsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async getUser(
    @Body()
    userId: string,
  ) {
    if (userId) {
      return {
        status: "ok",
        statusCode: 200,
        timestamp: new Date(),
        data: {
          id: (await this.usersService.getUser(userId)).id,
        },
      };
    }

    const user = await this.usersService.createUser();
    const roomId = await this.roomsService.createRoom(user.id);

    return {
      status: "ok",
      statusCode: 200,
      timestamp: new Date(),
      data: {
        user,
        roomId,
      },
    };
  }
}
