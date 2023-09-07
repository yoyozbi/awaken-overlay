import { Container, ContainerModule } from 'inversify';
import 'reflect-metadata';
import { TYPES } from './types';
import * as discord from "discord.js";
import ICommandService from './services/discord/ICommandsService';
import CommandsService from './services/discord/CommandsService';
import IClientService from './services/discord/IClientService';
import ClientService from "./services/discord/ClientService"
import ILoggerService from './services/discord/ILoggerService';
import LoggerService from "./services/discord/LoggerService";
import IEventsService from './services/discord/IEventsService';
import EventsService from './services/discord/EventsService';

type discordType = typeof discord;

const thirdPartyDependencies = new ContainerModule(bind => {
  bind<discordType>(TYPES.discord).toConstantValue(discord);
})


const applicationDependencies = new ContainerModule(bind => {
  bind<ICommandService>(TYPES.CommandsService).to(CommandsService).inSingletonScope();
  bind<IEventsService>(TYPES.EventsService).to(EventsService).inSingletonScope();
  bind<ILoggerService>(TYPES.LoggerService).to(LoggerService).inSingletonScope();
  bind<IClientService>(TYPES.ClientService).to(ClientService);
});

const container = new Container();

container.load(thirdPartyDependencies, applicationDependencies)
export { container };
