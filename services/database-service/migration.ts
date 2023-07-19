import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { config } from "dotenv";
import { Client } from "pg";

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

  const client = new Client({
    connectionString,
  });

  await client.connect();

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
