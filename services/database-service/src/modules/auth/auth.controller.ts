import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./services";
import { ValidateServer } from "./auth.service.types";
import { RtGuard } from "./guards";
import type { Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("validate-server")
  async validateServer(
    @Body()
    validateServer: ValidateServer,
  ) {
    const result = await this.authService.validateServer(validateServer);

    return {
      status: "ok",
      statusCode: 200,
      data: result,
    };
  }

  @Post("refresh-token")
  @UseGuards(RtGuard)
  async refreshToken(@Req() req: Request) {}
}
