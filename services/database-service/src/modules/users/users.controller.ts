import { Body, Controller, Inject, Post, Req } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Public } from "@/utils/decorators";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  async getUser(
    @Body()
    { userId }: { userId: string },
  ) {
    console.log("userId", userId);

    if (userId.length <= 0) {
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
        id: (await this.usersService.getUser(userId)).id,
      },
    };
  }
}
