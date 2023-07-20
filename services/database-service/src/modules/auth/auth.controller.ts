import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./services";
import { ValidateServer } from "./auth.service.types";
import { RtGuard } from "./guards";
import type { Request } from "express";
import { Public } from "@/utils/decorators";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("validate-server")
  async validateServer(@Body() validateServer: ValidateServer) {
    const result = await this.authService.validateServer(validateServer);

    return {
      status: "ok",
      statusCode: 200,
      data: result,
    };
  }
}
