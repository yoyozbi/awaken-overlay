import { injectable, inject } from "inversify";
import { type NodePgDatabase, drizzle } from "drizzle-orm/node-postgres"
import { Client } from "pg";
import ILoggerService from "../discord/ILoggerService";
import type IDBService from "./IDBService";
import { TYPES } from "../../types";

@injectable()
export default class DBService implements IDBService {
	private logger: ILoggerService;
	private db: NodePgDatabase;

	constructor(@inject(TYPES.LoggerService) logger: ILoggerService) {
		this.logger = logger;

		const client = new Client({ connectionString: process.env.POSTGRES_URL })

		if (process.env.NODE_ENV != "production") {
			this.db = drizzle(client, { logger: true });
		} else {
			this.db = drizzle(client);
		}
	}

	getDb(): NodePgDatabase {
		return this.db;
	}

}
