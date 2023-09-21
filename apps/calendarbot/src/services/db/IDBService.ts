import type { NodePgDatabase } from "drizzle-orm/node-postgres";

export default interface IDBService {
	getDb(): NodePgDatabase;
}
