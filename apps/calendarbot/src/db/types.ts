import { calendars } from "./schema";
import { guilds } from "./schema";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";


export type Calendar = InferSelectModel<typeof calendars>;
export type NewCalendar = InferInsertModel<typeof calendars>;

export type Guild = InferSelectModel<typeof guilds>;
export type NewGuild = InferInsertModel<typeof guilds>;
