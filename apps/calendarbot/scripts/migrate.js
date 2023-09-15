const postgres = require("postgres");
const { drizzle } = require("drizzle-orm/postgres-js");
const { migrate } = require("drizzle-orm/postgres-js/migrator");

export const migrate = async () => {
  const postgresUrl = process.env.POSTGRES_URL;
  if (!postgresUrl) {
    console.error("No POSTGRES_URL found ");
    return;
  }
  const client = postgres(postgresUrl, { max: 1 });

  const db = drizzle(client);
  await migrate(db, { migrationsFolder: './drizzle' });

}
