import type { Calendar, NewCalendar } from "../../db/types";
import type { GEvent } from "../../utils/Google";

export default interface ICalendarService {
	getEvents(id: string): Promise<GEvent[]>;
	getCalendar(id: number): Promise<Calendar | undefined>;
	createCalendar(data: NewCalendar): Promise<Calendar>;
	getCalendars(): Promise<Calendar[]>;
	getGuildCalendars(guildId: string): Promise<Calendar[]>;
}
