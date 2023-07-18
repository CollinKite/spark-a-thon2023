import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';
config({
  path: `.env.${process.env.NODE_ENV}`
})

export default {
  driver: "pg",
  "dbCredentials": {
    connectionString: "",
  }
} satisfies Config;