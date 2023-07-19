import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth";
import { DrizzleModule } from "./modules/drizzle";
import { MessagesModule } from "./modules/messages";
import { RoomsModule } from "./modules/rooms";

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    DrizzleModule,
    MessagesModule,
    RoomsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
