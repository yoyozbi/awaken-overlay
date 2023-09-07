import { pgTable, serial, text } from "drizzle-orm/pg-core";
import type { InferModel } from "drizzle-orm";

export const calendars = pgTable('calendars', {
  id: serial('id').primaryKey(),
  googleCalendarId: text('google_calendar_id'),
  channelId: text('channel_id'),
  messageId: text('message_id')
})

export type Calendar = InferModel<typeof calendars>;
export type NewCalendar = InferModel<typeof calendars, 'insert'>
