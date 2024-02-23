CREATE TABLE IF NOT EXISTS "calendars" (
	"id" serial PRIMARY KEY NOT NULL,
	"google_calendar_id" text,
	"channel_id" text
);
