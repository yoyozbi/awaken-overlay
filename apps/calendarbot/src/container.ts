import 'reflect-metadata';
import { Container, ContainerModule } from 'inversify';
import { TYPES } from './types';
import * as discord from "discord.js";
import type Event from './interfaces/Event';
import type IClientService from './services/discord/IClientService';
import ClientService from "./services/discord/ClientService"
import type ILoggerService from './services/discord/ILoggerService';
import LoggerService from "./services/discord/LoggerService";
import { Command } from './interfaces/Command';
import PingCommand from './commands/Ping';
import HelloCommand from './commands/Hello';
import InteractionEvent from './events/onInteraction';
import ReadyEvent from './events/onReady';
import type IDBService from './services/db/IDBService';
import DbService from './services/db/DBService';
import type ICalendarService from './services/db/ICalendarService';
import CalendarService from './services/db/CalendarService';
import IGuildService from './services/db/IGuildService';
import GuildService from './services/db/GuildService';
import RegisterCommand from './commands/register';

type discordType = typeof discord;

const thirdPartyDependencies = new ContainerModule(bind => {
  bind<discordType>(TYPES.discord).toConstantValue(discord);
})


const applicationDependencies = new ContainerModule(bind => {
  // DB
  bind<IDBService>(TYPES.DBService).to(DbService).inSingletonScope()
  bind<ICalendarService>(TYPES.CalendarService).to(CalendarService).inSingletonScope()
  bind<IGuildService>(TYPES.GuildService).to(GuildService).inSingletonScope()


  // Discord
  bind<IClientService>(TYPES.ClientService).to(ClientService);
  bind<ILoggerService>(TYPES.LoggerService).to(LoggerService).inSingletonScope();

  // Events
  bind<Event<any>>(TYPES.Events).to(InteractionEvent).inSingletonScope();
  bind<Event<any>>(TYPES.Events).to(ReadyEvent).inSingletonScope();

  // Commands
  bind<Command>(TYPES.Commands).to(PingCommand).inSingletonScope();
  bind<Command>(TYPES.Commands).to(HelloCommand).inSingletonScope();
  bind<Command>(TYPES.Commands).to(RegisterCommand).inSingletonScope();

});

const container = new Container();

container.load(thirdPartyDependencies, applicationDependencies)
export { container };
