import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const calendars = pgTable('calendars', {
	id: serial('id').primaryKey(),
	googleCalendarId: text('google_calendar_id').notNull(),
	channelId: text('channel_id').notNull(),
	messageId: text('message_id'),
	guildId: integer('guild_id').references(() => guilds.id).notNull(),
	schedule: text('schedule').notNull().default("'*/15 * * * *'"),
	numberOfDays: integer('numberOfDays').notNull().default(7)
})

export const guilds = pgTable('guilds', {
	id: serial('id').primaryKey(),
	guildId: text('guild_id').notNull().unique(),
})
