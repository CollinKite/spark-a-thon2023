import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AtGuard, AuthModule } from "./modules/auth";
import { DrizzleModule } from "./modules/drizzle";
import { MessagesModule } from "./modules/messages";
import { RoomsModule } from "./modules/rooms";
import { APP_GUARD } from "@nestjs/core";

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
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
