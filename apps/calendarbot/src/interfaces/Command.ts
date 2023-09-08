import type { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, CommandInteraction } from "discord.js";
export interface Command {
  getData: () => SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  run: (interaction: CommandInteraction) => Promise<void>;
}
