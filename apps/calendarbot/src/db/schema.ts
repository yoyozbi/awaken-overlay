import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const calendars = pgTable('calendars', {
	id: serial('id').primaryKey(),
	googleCalendarId: text('google_calendar_id'),
	channelId: text('channel_id'),
	messageId: text('message_id')
})
