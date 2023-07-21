import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./services";
import { ValidateServer } from "./auth.service.types";
import { RtGuard } from "./guards";
import { Public } from "@/utils/decorators";
import type { Request } from "express";

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

  @Public()
  @Post("validate-user")
  async validateUser(
    @Body()
    userId: string,
  ) {
    const result = await this.authService.generateTokens(userId);

    return {
      status: "ok",
      statusCode: 200,
      data: result,
    };
  }

  @Post("refresh-token")
  @UseGuards(RtGuard)
  async refreshToken(@Req() req: Request) {
    const refresh_token = req.headers.authorization.split(" ")[1];

    const result = await this.authService.verifyRefresh(refresh_token);

    if (result.success) {
      const tokens = await this.authService.generateTokens(result.username);

      return {
        status: "ok",
        statusCode: 200,
        timestamp: new Date(),
        data: tokens,
      };
    }

    throw new UnauthorizedException("GET OUT");
  }
}
