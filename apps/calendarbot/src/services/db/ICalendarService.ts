import type { Calendar, NewCalendar } from "../../types/db";
import type { GEvent } from "../../utils/Google";

export default interface ICalendarService {
  getEvents(id: string): Promise<GEvent[]>;
  getCalendar(id: number): Promise<Calendar | undefined>;
  createCalendar(data: NewCalendar): Promise<Calendar>;
}
