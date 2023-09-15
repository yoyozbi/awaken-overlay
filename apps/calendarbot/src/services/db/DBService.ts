import { injectable, inject } from "inversify";
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import ILoggerService from "../discord/ILoggerService";
import type IDBService from "./IDBService";
import { TYPES } from "../../types";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

@injectable()
export default class DBService implements IDBService {
  private logger: ILoggerService;
  private db: PostgresJsDatabase<Record<string, never>>;

  constructor(@inject(TYPES.LoggerService) logger: ILoggerService) {
    this.logger = logger;
    this.db = drizzle(postgres(process.env.POSTGRES_URL));
  }

  getDb(): PostgresJsDatabase<Record<string, never>> {
    return this.db;
  }

}
