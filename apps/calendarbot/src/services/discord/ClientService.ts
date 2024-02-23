import { multiInject, inject, injectable } from "inversify"
import IClientService from "./IClientService"
import { type Client as DiscordClient, GatewayIntentBits } from "discord.js"
import type Event from "../../interfaces/Event"
import * as discordjs from "discord.js"
import { TYPES } from '../../types';
import ILoggerService from './ILoggerService';

@injectable()
export default class ClientService implements IClientService {
  private client: DiscordClient;
  private logger: ILoggerService;
  private events: Event<any>[];


  constructor(
    @multiInject(TYPES.Events) events: Event<any>[],
    @inject(TYPES.LoggerService) logger: ILoggerService,
    @inject(TYPES.discord) discord: typeof discordjs
  ) {
    this.logger = logger;
    this.events = events;

    this.client = new discord.Client({ intents: GatewayIntentBits.Guilds });

  }

  private registerEvents() {
    for (let event of this.events) {
      this.client.on(event.name, event.run.bind(event));
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
