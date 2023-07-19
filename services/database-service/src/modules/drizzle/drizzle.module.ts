import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@/schemas";

import {
  getDrizzleConfigToken,
  getDrizzleInstanceToken,
} from "./drizzle.constants";
import { Database, DrizzleConfig } from "./drizzle.types";
import { Client } from "pg";

@Global()
@Module({
  providers: [
    {
      provide: getDrizzleConfigToken(),
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const getDatabaseConfig = async (): Promise<DrizzleConfig> => {
          return {
            host: config.get<string>("PG_HOST"),
            port: config.get<number>("PG_PORT"),
            user: config.get<string>("PG_USER"),
            password: config.get<string>("PG_PASSWORD"),
          };
        };

        return await getDatabaseConfig();
      },
    },
    {
      provide: getDrizzleInstanceToken(),
      inject: [getDrizzleConfigToken()],
      useFactory: async ({
        host,
        password,
        user,
        ...config
      }: DrizzleConfig): Promise<Database> => {
        const uri = `postgres://${user}:${password}@${host}:${config.port}`;

        const client = new Client({
          connectionString: uri,
        });

        await client.connect();

        const db = drizzle(client, { logger: true, schema });

        return db;
      },
    },
  ],
  exports: [getDrizzleInstanceToken()],
})
export class DrizzleModule {}
