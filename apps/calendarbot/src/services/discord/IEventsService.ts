import { ClientEvents, Events } from "discord.js";
import { Command } from "../../interfaces/Command";
import ILoggerService from "./ILoggerService";

export default interface IEventsService {
  addEvent<K extends keyof ClientEvents = Events.ClientReady>(name: K, listener: (commands: Command[], logger: ILoggerService, ...args: ClientEvents[K]) => Promise<void>): IEventsService;
  addEvent<K extends keyof ClientEvents>(name: K, listener: (logger: ILoggerService, ...args: ClientEvents[K]) => Promise<void>): IEventsService;
  getEvents(): { eventName: string, func: (...args: any[]) => Promise<void> }[];
}
