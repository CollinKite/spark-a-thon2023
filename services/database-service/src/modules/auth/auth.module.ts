import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AtStrategy, AuthService, RtStrategy } from "./services";
import { AtGuard, RtGuard } from "./guards";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [JwtModule.register({}), PassportModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy, AtGuard, RtGuard],
})
export class AuthModule {}
