import type { Guild } from "../../db/types";
export default interface IGuildService {
  upsertGuild(guildId: string): Promise<Guild>;
  createGuild(guildId: string): Promise<Guild>;
  getGuild(guildId: string): Promise<Guild | undefined>;
}
