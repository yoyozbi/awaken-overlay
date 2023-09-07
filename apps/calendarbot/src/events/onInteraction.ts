import type { Interaction } from "discord.js";
import { CommandList } from "../commands/_CommandList";
import ILoggerService from "../services/discord/ILoggerService";
export const onInteraction = async (_: ILoggerService, interaction: Interaction) => {
  if (!interaction.isCommand()) {
    return;
  }

  for (const command of CommandList) {
    if (interaction.commandName == command.data.name) {
      await command.run(interaction);
      break;
    }
  }
};

