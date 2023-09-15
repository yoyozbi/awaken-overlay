import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export default interface IDBService {
  getDb(): PostgresJsDatabase<Record<string, never>>
}
