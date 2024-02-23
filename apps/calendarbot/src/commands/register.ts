import { injectable, inject } from "inversify";
import type { Command } from "../interfaces/Command";
import { ChannelType, CommandInteraction, PermissionFlagsBits, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import type ILoggerService from "../services/discord/ILoggerService";
import type IGuildService from "../services/db/IGuildService";
import type ICalendarService from "../services/db/ICalendarService";
import { TYPES } from "../types";

enum NumberOfDays {
	ONE_DAY = "1",
	TWO_DAYS = "2",
	THREE_DAYS = "3",
	FOR_DAYS = "4",
	FIVE_DAYS = "5",
	SIX_DAYS = "6",
	ONE_WEEK = "7",
	TWO_WEEK = "14"
}
enum Cron {
	EVERY_1MINUTE = "* * * * *",
	EVERY_5MINUTES = "*/5 * * * *",
	EVERY_10MINUTES = "*/10 * * * *",
	EVERY_15MINUTES = "*/15 * * * *",
	EVERY_20MINUTES = "*/20 * * * *",
	EVERY_HOUR = "0 * * * *"
}

@injectable()
export default class RegisterCommand implements Command {
	private logger: ILoggerService;
	private guildService: IGuildService;
	private calendarService: ICalendarService;
	constructor(@inject(TYPES.LoggerService) logger: ILoggerService,
		@inject(TYPES.GuildService) guildService: IGuildService,
		@inject(TYPES.CalendarService) calendarService: ICalendarService) {
		this.logger = logger;
		this.guildService = guildService;
		this.calendarService = calendarService;
	}
	getData(): SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder {
		return new SlashCommandBuilder()
			.setName("register")
			.setDescription("Register a new google calendar to watch.")
			.addChannelOption(option =>
				option
					.setName("channel")
					.setDescription("The chanel to display the message in")
					.addChannelTypes(ChannelType.GuildText)
					.setRequired(true))
			.addStringOption(option =>
				option
					.setName("calendar")
					.setDescription("The google calendar id")
					.setRequired(true)
			)
			.addStringOption(option =>
				option
					.setName('days')
					.setDescription('The number of days in advance to display')
					.setRequired(true)
					.addChoices(
						{ name: 'one day', value: NumberOfDays.ONE_DAY },
						{ name: "two days", value: NumberOfDays.TWO_DAYS },
						{ name: 'three days', value: NumberOfDays.THREE_DAYS },
						{ name: 'four days', value: NumberOfDays.FOR_DAYS },
						{ name: 'five days', value: NumberOfDays.FIVE_DAYS },
						{ name: 'six days', value: NumberOfDays.SIX_DAYS },
						{ name: 'one week', value: NumberOfDays.ONE_WEEK },
						{ name: 'two weeks', value: NumberOfDays.TWO_WEEK }
					))
			.addStringOption(option =>
				option
					.setName("interval")
					.setDescription("The interval of time to check for new events (defaults every 15 minutes)")
					.addChoices(
						{ name: 'Every minute', value: Cron.EVERY_1MINUTE },
						{ name: 'Every 5 minutes', value: Cron.EVERY_5MINUTES },
						{ name: 'Every 10 minutes', value: Cron.EVERY_10MINUTES },
						{ name: 'Every 15 minutes', value: Cron.EVERY_15MINUTES },
						{ name: 'Every 20 minutes', value: Cron.EVERY_20MINUTES },
						{ name: 'Every hour', value: Cron.EVERY_HOUR }
					))
			.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
	}

	async run(interaction: CommandInteraction): Promise<void> {
		await interaction.deferReply({ ephemeral: true })
		const channel = interaction.options.data[0].value as ChannelType.GuildText;
		const calendarId = interaction.options.get("calendar", true).value as string;
		const numberOfDays = interaction.options.get("days", true).value as string;
		const interval = interaction.options.get("interval", false)?.value || Cron.EVERY_15MINUTES;

		this.logger.log(`channel: ${channel}, calendarId: ${calendarId}, numberOfDays: ${numberOfDays}, interval: ${interval}`);

		const guild = await this.guildService.upsertGuild(interaction.guildId!);

		await this.calendarService
			.createCalendar({ guildId: guild.id, googleCalendarId: calendarId?.toString(), numberOfDays: parseInt(numberOfDays), schedule: interval.toString(), channelId: channel.toString() })


		await interaction.editReply({ content: "I will now watch your calendar" });
	}
}
