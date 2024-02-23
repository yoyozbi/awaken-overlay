import { injectable, inject } from 'inversify';
import IGuildService from './IGuildService';
import { guilds } from '../../db/schema';
import type { Guild } from '../../db/types';
import type IDBService from './IDBService';
import { TYPES } from '../../types';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import LoggerService from '../discord/LoggerService';
import ILoggerService from '../discord/ILoggerService';

@injectable()
export default class GuildService implements IGuildService {
	private db: NodePgDatabase | undefined;
	private logger: ILoggerService;
	constructor(@inject(TYPES.DBService) private dbService: IDBService, @inject(TYPES.LoggerService) loggerService: ILoggerService) {
		dbService.getDb().then((db) => this.db = db);
		this.logger = loggerService;
	}
	async getGuild(guildId: string): Promise<Guild | undefined> {
		if (!this.db)
			return;

		const results = await this.db.select().from(guilds).where(eq(guilds.guildId, guildId));
		if (results.length == 0)
			return;
		return results[0];
	}

	async upsertGuild(guildId: string): Promise<Guild> {
		if (!this.db)
			throw new Error("No database connection");

		let result = await this.getGuild(guildId);

		this.logger.log(result as never as string);

		if (result)
			return result;

		return await this.createGuild(guildId);
	}
	async createGuild(guildId: string): Promise<Guild> {
		if (!this.db)
			throw new Error("No database connection");

		const results = await this.db.insert(guilds).values({ guildId }).returning();
		return results[0];
	}
}
