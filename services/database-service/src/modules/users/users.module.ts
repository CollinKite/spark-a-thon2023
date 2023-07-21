import { Module } from "@nestjs/common";
import { RoomsModule } from "../rooms";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [RoomsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
