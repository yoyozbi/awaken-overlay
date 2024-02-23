import { injectable, inject } from "inversify";
import { type NodePgDatabase, drizzle } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { Client } from "pg";
import type ILoggerService from "../discord/ILoggerService";
import type IDBService from "./IDBService";
import { TYPES } from "../../types";

@injectable()
export default class DBService implements IDBService {
	private logger: ILoggerService;
	private db: NodePgDatabase | undefined;

	constructor(@inject(TYPES.LoggerService) logger: ILoggerService) {
		this.logger = logger;
	}

	async connect(): Promise<NodePgDatabase> {
		let res: NodePgDatabase;
		const client = new Client({ connectionString: process.env.POSTGRES_URL })
		await client.connect()

		if (process.env.NODE_ENV != "production") {
			res = drizzle(client, { logger: true });
		} else {
			res = drizzle(client);
		}

		await migrate(res, { migrationsFolder: "./drizzle" })

		return res;
	}

	async getDb(): Promise<NodePgDatabase> {
		if (!this.db)
			this.db = await this.connect();
		return this.db;
	}

}
