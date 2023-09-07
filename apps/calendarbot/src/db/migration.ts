import postgres from "postgres"
import {drizzle} from "drizzle-orm/postgres-js"
import { migrate as postgresMigrate } from "drizzle-orm/postgres-js/migrator"

export const migrate = async () => {
  const client = postgres(process.env.POSTGRES_URL, {max: 1});

  const db = drizzle(client);
  await postgresMigrate(db, {migrationsFolder: './drizzle'});

}
