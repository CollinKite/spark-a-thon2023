import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const bootstrap = new Logger("Bootstrap");
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);
  const PORT = config.get<number>("PORT");
  app.setGlobalPrefix("database");

  await app.listen(PORT, async () =>
    bootstrap.log(`Service listening on ${await app.getUrl()}`),
  );
}
bootstrap();
