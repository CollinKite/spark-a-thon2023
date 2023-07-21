import { Body, Controller, Inject, Post, Req } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Public } from "@/utils/decorators";
import { RoomsService } from "../rooms/rooms.service";

@Controller("users")
export class UsersController {
  constructor(
    @Inject(RoomsService)
    private readonly roomsService: RoomsService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post()
  async getUser(
    @Body()
    userId: string,
  ) {

    if (userId["userId"].length <= 0) {
      const user = await this.usersService.createUser();

      return {
        status: "ok",
        statusCode: 200,
        timestamp: new Date(),
        data: user,
      };
    }

    return {
      status: "ok",
      statusCode: 200,
      timestamp: new Date(),
      data: {
        id: (await this.usersService.getUser(userId["userId"])).id,
      },
    };
  }
}
