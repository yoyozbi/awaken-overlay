import 'reflect-metadata';
import { Container, ContainerModule } from 'inversify';
import { TYPES } from './types';
import type IEvent from './services/discord/IEvent';
import * as discord from "discord.js";
import IClientService from './services/discord/IClientService';
import ClientService from "./services/discord/ClientService"
import ILoggerService from './services/discord/ILoggerService';
import LoggerService from "./services/discord/LoggerService";
import { Command } from './interfaces/Command';
import PingCommand from './commands/Ping';
import HelloCommand from './commands/Hello';
import InteractionEvent from './events/onInteraction';
import ReadyEvent from './events/onReady';

type discordType = typeof discord;

const thirdPartyDependencies = new ContainerModule(bind => {
  bind<discordType>(TYPES.discord).toConstantValue(discord);
})


const applicationDependencies = new ContainerModule(bind => {
  bind<IClientService>(TYPES.ClientService).to(ClientService);
  bind<ILoggerService>(TYPES.LoggerService).to(LoggerService).inSingletonScope();

  // Events
  bind<IEvent>(TYPES.Events).to(InteractionEvent).inSingletonScope();
  bind<IEvent>(TYPES.Events).to(ReadyEvent).inSingletonScope();

  // Commands
  bind<Command>(TYPES.Commands).to(PingCommand).inSingletonScope();
  bind<Command>(TYPES.Commands).to(HelloCommand).inSingletonScope();

});

const container = new Container();

container.load(thirdPartyDependencies, applicationDependencies)
export { container };
