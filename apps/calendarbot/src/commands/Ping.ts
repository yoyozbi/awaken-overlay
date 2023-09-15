import { injectable } from "inversify";
import { CommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

import type { Command } from "../interfaces/Command";
// import { GetCalendarEvents } from "../utils/Google";

@injectable()
export default class PingCommand implements Command {

	getData(): SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder {
		return new SlashCommandBuilder()
			.setName('ping')
			.setDescription('Replies with Pong!');
	}

	async run(interaction: CommandInteraction) {
		interaction.reply("pong!")
		// const events = await GetCalendarEvents("eda631a25a780768210f7be8a268433aece173532b5ddc27631ad56f0d717126@group.calendar.google.com");

		// console.log(events);
	}
}
