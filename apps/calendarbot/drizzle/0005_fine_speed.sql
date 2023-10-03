ALTER TABLE "guilds" RENAME COLUMN "channel_id" TO "guild_id";--> statement-breakpoint
ALTER TABLE "guilds" DROP CONSTRAINT "guilds_channel_id_unique";--> statement-breakpoint
--ALTER TABLE "guilds" ADD CONSTRAINT "guilds_guild_id_unique" UNIQUE("guild_id");
