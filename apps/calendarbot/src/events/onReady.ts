import { Client, REST, Routes } from "discord.js";
import { Command } from "../interfaces/Command";
import ILoggerService from "../services/discord/ILoggerService";

export const onReady = async (commands: Command[], logger: ILoggerService, bot: Client) => {
  logger.log(`Ready! Logged in as ${bot.user?.tag}`)

  if (!bot.user) {
    logger.logError("No user when bot ready");
    return;
  }


  // Registering commands
  const commandData = commands.map(command => command.data.toJSON());
  const rest = new REST().setToken(process.env.DISCORD_TOKEN);

  try {
    logger.log(`Started refreshing ${commandData.length} application commmands`);

    await rest.put(
      Routes.applicationCommands(bot.user.id),
      { body: commandData }
    );

    logger.log("Successfully reloaded application commands");
  }
  catch (error) {
    logger.logError(error);
  }
}
