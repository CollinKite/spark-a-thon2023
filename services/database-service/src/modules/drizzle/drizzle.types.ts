import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "@/schemas";

export type DrizzleConfig = {
  host: string;
  database: string;
  user: string;
  port: number;
  password: string;
};

export type Database = PostgresJsDatabase<typeof schema>;
