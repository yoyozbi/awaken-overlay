import { injectable, inject } from "inversify";
import type ICalendarService from "./ICalendarService";
import type { Calendar, NewCalendar } from "../../db/types"
import { calendars, guilds } from "../../db/schema";
import { type GEvent, GetCalendarEvents } from "../../utils/Google";
import { TYPES } from "../../types";
import type IDBService from "./IDBService";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

@injectable()
export default class CalendarService implements ICalendarService {
	private db: NodePgDatabase | undefined;

	constructor(@inject(TYPES.DBService) dbService: IDBService) {
		dbService.getDb().then(db => this.db = db);
	}

	async getEvents(id: string): Promise<GEvent[]> {
		const events = await GetCalendarEvents(id);

		if (!events) {
			return [];
		}

		return events.items;
	}

	async getCalendar(id: number): Promise<Calendar | undefined> {
		if (!this.db)
			return;

		const results = await this.db.select().from(calendars).where(eq(calendars.id, id))
		return results[0];
	}

	async getCalendars(): Promise<Calendar[]> {
		if (!this.db)
			return [];

		return await this.db.select().from(calendars);
	}

	async getGuildCalendars(guildId: string): Promise<Calendar[]> {
		if (!this.db)
			return [];

		return await this.db.select({
			id: calendars.id,
			guildId: calendars.guildId,
			channelId: calendars.channelId,
			googleCalendarId: calendars.googleCalendarId,
			messageId: calendars.messageId,
			schedule: calendars.schedule,
			numberOfDays: calendars.numberOfDays
		})
			.from(calendars)
			.leftJoin(guilds, eq(calendars.guildId, guilds.id))
			.where(eq(guilds.guildId, guildId));
	}

	async createCalendar(data: NewCalendar): Promise<Calendar> {
		if (!this.db)
			throw new Error("No database connection");

		const results = await this.db.insert(calendars).values(data).returning()
		return results[0];
	}
}
