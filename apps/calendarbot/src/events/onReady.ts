import { inject, injectable, multiInject } from "inversify";
import { Client, REST, Routes } from "discord.js";
import type Event from "../interfaces/Event";
import { Command } from "../interfaces/Command";
import type ILoggerService from "../services/discord/ILoggerService";
import { TYPES } from "../types";


@injectable()
export default class ReadyEvent implements Event<"ready"> {
  commands: Command[];
  logger: ILoggerService;

  public name: "ready" = "ready";

  constructor(@multiInject(TYPES.Commands) commands: Command[], @inject(TYPES.LoggerService) logger: ILoggerService) {
    this.commands = commands;

    this.logger = logger;
  }

  async run(client: Client<true>): Promise<void> {
    this.logger.log(`Ready! Logged in as ${client.user?.tag}`)

    if (!client.user) {
      this.logger.logError("No user when bot ready");
      return;
    }


    // Registering commands
    const commandData = this.commands.map(command => command.getData().toJSON());
    const rest = new REST().setToken(process.env.DISCORD_TOKEN);

    try {
      this.logger.log(`Started refreshing ${commandData.length} application commmands`);

      await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commandData }
      );

      this.logger.log("Successfully reloaded application commands");
    }
    catch (error) {
      this.logger.logError(error);
    }
  }
}
