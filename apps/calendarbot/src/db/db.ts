import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
export const db = drizzle(postgres(process.env.POSTGRES_URL));
