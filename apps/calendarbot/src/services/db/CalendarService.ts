import { injectable, inject } from "inversify";
import type ICalendarService from "./ICalendarService";
import type { Calendar, NewCalendar } from "../../db/types"
import { calendars, guilds } from "../../db/schema";
import { type GEvent, GetCalendarEvents } from "../../utils/Google";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { TYPES } from "../../types";
import IDBService from "./IDBService";
import { eq } from "drizzle-orm";

@injectable()
export default class CalendarService implements ICalendarService {
	private db: PostgresJsDatabase<Record<string, never>>;

	constructor(@inject(TYPES.DBService) dbService: IDBService) {
		this.db = dbService.getDb();
	}

	async getEvents(id: string): Promise<GEvent[]> {
		const events = await GetCalendarEvents(id);

		if (!events) {
			return [];
		}

		return events.items;
	}

	async getCalendar(id: number): Promise<Calendar | undefined> {
		const results = await this.db.select().from(calendars).where(eq(calendars.id, id))
		return results[0];
	}

	async getCalendars(): Promise<Calendar[]> {
		return await this.db.select().from(calendars);
	}

	async getGuildCalendars(guildId: string): Promise<Calendar[]> {
		return await this.db.select({
			id: calendars.id,
			guildId: calendars.guildId,
			channelId: calendars.channelId,
			googleCalendarId: calendars.googleCalendarId,
			messageId: calendars.messageId
		})
			.from(calendars)
			.leftJoin(guilds, eq(calendars.guildId, guilds.id))
			.where(eq(guilds.guildId, guildId));
	}

	async createCalendar(data: NewCalendar): Promise<Calendar> {
		const results = await this.db.insert(calendars).values(data).returning()
		return results[0];
	}
}
