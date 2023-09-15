import { calendars } from "./schema";
import { guilds } from "./schema";
import type { InferModel } from "drizzle-orm";


export type Calendar = InferModel<typeof calendars>;
export type NewCalendar = InferModel<typeof calendars, 'insert'>

export type Guild = InferModel<typeof guilds>;
export type NewGuild = InferModel<typeof guilds, 'insert'>
