import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { config } from "dotenv";
import * as postgres from "postgres";

config({
  path: `.env.${process.env.NODE_ENV}`,
});

const main = async () => {
  console.log("running migration...\n");
  const config = {
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  };

  const connectionString = `postgres://${config.user}:${config.password}@${config.host}:${config.port}`;

  const client = postgres(connectionString, { max: 1 });

  const db = drizzle(client);

  await migrate(db, { migrationsFolder: "./.drizzle" });
};

main()
  .catch((error) => {
    console.error(error);
  })
  .then(() => {
    console.log("migration complete");
  })
  .finally(() => {
    process.exit(1);
  });
