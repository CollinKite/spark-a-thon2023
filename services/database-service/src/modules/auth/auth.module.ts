import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AtStrategy, AuthService, RtStrategy } from "./services";
import { AtGuard, RtGuard } from "./guards";

@Module({
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy, AtGuard, RtGuard],
})
export class AuthModule {}
