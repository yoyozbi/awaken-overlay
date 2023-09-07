import { inject, injectable } from "inversify"
import IClientService from "./IClientService"
import { type Client as DiscordClient, GatewayIntentBits, Events, Routes } from "discord.js"
import * as discordjs from "discord.js"
import { TYPES } from '../../types';
import ICommandService from './ICommandsService';
import ILoggerService from './ILoggerService';
import IEventsService from './IEventsService';

@injectable()
export default class ClientService implements IClientService {
  private client: DiscordClient;
  private commands: ICommandService;
  private logger: ILoggerService;
  private events: IEventsService;


  constructor(
    @inject(TYPES.CommandsService) commands: ICommandService,
    @inject(TYPES.EventsService) events: IEventsService,
    @inject(TYPES.LoggerService) logger: ILoggerService,
    @inject(TYPES.discord) discord: typeof discordjs
  ) {
    this.commands = commands;
    this.logger = logger;
    this.events = events;

    this.client = new discord.Client({ intents: GatewayIntentBits.Guilds });

  }

  private registerEvents() {
    for (let event of this.events.getEvents()) {
      if (event.eventName == "ready") {
        this.client.on("ready", (client) => event.func(this.commands.getCommands(), this.logger, client))
      } else {
        this.client.on(event.eventName, (...args) => event.func(this.logger, ...args));
      }
    }
  }

  login(): void {
    this.registerEvents();
    this.client.login(process.env.DISCORD_TOKEN);
  }

  getClient(): DiscordClient<boolean> {
    return this.client;
  }
}
