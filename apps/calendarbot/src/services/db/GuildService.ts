import { injectable, inject } from 'inversify';
import IGuildService from './IGuildService';
import { guilds } from '../../db/schema';
import type { Guild, NewGuild } from '../../db/types';
import type IDBService from './IDBService';
import { TYPES } from '../../types';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import LoggerService from '../discord/LoggerService';
import ILoggerService from '../discord/ILoggerService';

@injectable()
export default class GuildService implements IGuildService {
	private db: NodePgDatabase;
	private logger: ILoggerService;
	constructor(@inject(TYPES.DBService) private dbService: IDBService, @inject(TYPES.LoggerService) loggerService: ILoggerService) {
		this.db = dbService.getDb();
		this.logger = loggerService;
	}
	async getGuild(guildId: string): Promise<Guild | undefined> {
		const results = await this.db.select().from(guilds).where(eq(guilds.guildId, guildId));
		this.logger.log("get")
		if (results.length == 0)
			return;
		return results[0];
	}

	async upsertGuild(guildId: string): Promise<Guild> {
		let result = await this.getGuild(guildId);
		this.logger.log("Hello")

		this.logger.log(result as never as string);

		if (result)
			return result;

		return await this.createGuild(guildId);
	}
	async createGuild(guildId: string): Promise<Guild> {
		const results = await this.db.insert(guilds).values({ guildId }).returning();
		return results[0];
	}
}
