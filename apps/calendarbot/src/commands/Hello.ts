import { injectable } from "inversify";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces/Command";

@injectable()
export default class HelloCommand implements Command {
  getData() {
    return new SlashCommandBuilder()
      .setName("hello")
      .setDescription("Greets you!");
  }
  async run(interaction: CommandInteraction) {
    interaction.reply("Hello!");
  }
}
