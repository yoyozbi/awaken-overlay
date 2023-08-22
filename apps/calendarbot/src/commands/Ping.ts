import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import type { Command } from "../interfaces/Command";

import {google} from "googleapis";
import { GetCalendarEvents } from "../utils/Google";

export const ping: Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),

  run: Run
};

async function Run(interaction: CommandInteraction)
{
  interaction.reply("pong!");

  const events = await GetCalendarEvents("eda631a25a780768210f7be8a268433aece173532b5ddc27631ad56f0d717126@group.calendar.google.com");

  console.log(events);
}
