import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./services";
import { ValidateServer } from "./auth.service.types";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("validate-server")
  async validateServer(
    @Body()
    validateServer: ValidateServer,
  ) {
    return await this.authService.validateServer(validateServer);
  }
}
