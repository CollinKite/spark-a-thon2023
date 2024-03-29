import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "@/schemas";

export type DrizzleConfig = {
  host: string;
  user: string;
  port: number;
  password: string;
};

export type Database = NodePgDatabase<typeof schema>;
