import { Body, Controller, Post } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async getUser(
    @Body()
    userId: string,
  ) {
    return userId
      ? await this.usersService.getUser(userId)
      : await this.usersService.createUser();
  }
}
