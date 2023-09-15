import { calendars } from "./schema";
import type { InferModel } from "drizzle-orm";


export type Calendar = InferModel<typeof calendars>;
export type NewCalendar = InferModel<typeof calendars, 'insert'>
