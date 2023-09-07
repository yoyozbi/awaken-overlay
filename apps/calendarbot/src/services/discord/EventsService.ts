import { injectable } from "inversify";
import { ClientEvents, Events } from "discord.js";
import IEventsService from "./IEventsService";
import { Command } from "../../interfaces/Command";

@injectable()
export default class EventsService implements IEventsService {
  private events: { eventName: string, func: (...args: any[]) => Promise<void> }[];

  constructor() {
    this.events = [];
  }

  addEvent<K extends keyof ClientEvents = Events.ClientReady>(name: K, listener: (commands: Command[], ...args: ClientEvents[K]) => Promise<void>): IEventsService;
  addEvent<K extends keyof ClientEvents>(name: K, listener: (...args: ClientEvents[K]) => Promise<void>): IEventsService;
  addEvent(name: unknown, listener: unknown): IEventsService {
    this.events.push({ eventName: name as string, func: listener as (...args: any[]) => Promise<void> });
    return this;
  }
  getEvents(): { eventName: string, func: (args: unknown[]) => Promise<void> }[] {
    return this.events;
  }

}
