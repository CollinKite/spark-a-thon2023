import type { Config } from "drizzle-kit";
import { config } from "dotenv";
config({
  path: `.env.${process.env.NODE_ENV}`,
});

export default {
  schema: "./src/schemas",
  driver: "pg",
  dbCredentials: {
    connectionString: `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}`,
  },
  out: "./.drizzle",
} satisfies Config;
