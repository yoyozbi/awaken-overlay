import { eq } from "drizzle-orm";
import {db} from "./db";
import { type Calendar, calendars } from "./schema";

export async function getCalendarById(id: number) : Promise<Calendar|null>
{
  return await db.select().from(calendars).where(eq(calendars.id,id))
}

export async function getCalendars() : Promise<Calendar[]>
{
  return await db.select().from(calendars);
}
