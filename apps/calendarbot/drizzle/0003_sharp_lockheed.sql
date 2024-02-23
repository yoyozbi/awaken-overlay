ALTER TABLE "calendars" ADD COLUMN "schedule" text DEFAULT '*/15 * * * *' NOT NULL;--> statement-breakpoint
ALTER TABLE "calendars" ADD COLUMN "numberOfDays" integer DEFAULT 7 NOT NULL;
