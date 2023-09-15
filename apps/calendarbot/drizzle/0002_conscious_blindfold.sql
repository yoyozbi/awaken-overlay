CREATE TABLE IF NOT EXISTS "guilds" (
	"id" serial PRIMARY KEY NOT NULL,
	"channel_id" text NOT NULL,
	CONSTRAINT "guilds_channel_id_unique" UNIQUE("channel_id")
);
--> statement-breakpoint
ALTER TABLE "calendars" ALTER COLUMN "google_calendar_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "calendars" ALTER COLUMN "channel_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "calendars" ALTER COLUMN "message_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "calendars" ADD COLUMN "guild_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendars" ADD CONSTRAINT "calendars_guild_id_guilds_id_fk" FOREIGN KEY ("guild_id") REFERENCES "guilds"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
