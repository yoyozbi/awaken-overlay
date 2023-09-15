import { injectable, inject } from 'inversify';
import IGuildService from './IGuildService';
import { guilds } from '../../db/schema';
import type { Guild, NewGuild } from '../../db/types';
import type IDBService from './IDBService';
import { TYPES } from '../../types';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';

@injectable()
export default class GuildService implements IGuildService {
  private db: PostgresJsDatabase<Record<string, never>>;
  constructor(@inject(TYPES.DBService) private dbService: IDBService) {
    this.db = dbService.getDb();
  }
  async getGuild(guildId: string): Promise<Guild | undefined> {
    const results = await this.db.select().from(guilds).where(eq(guilds.guildId, guildId));
    if (results.length == 0)
      return;
    return results[0];
  }

  async upsertGuild(guildId: string): Promise<Guild> {
    let result = await this.getGuild(guildId);

    if (result)
      return result;

    return await this.createGuild(guildId);
  }
  async createGuild(guildId: string): Promise<Guild> {
    const results = await this.db.insert(guilds).values({ guildId }).returning();
    return results[0];
  }
}
