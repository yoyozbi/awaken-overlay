if (process.env.NODE_ENV != "production") {
  require('dotenv').config({ path: "./.env" });
}

// import "./utils/EnvValidation";
// import {Client, Events, GatewayIntentBits} from "discord.js";
// import { onReady } from "./events/onReady";
// import { onInteraction } from "./events/onInteraction";

// const client = new Client({ intents: GatewayIntentBits.Guilds});

// client.on(Events.ClientReady, async () => await onReady(client));

// client.on(Events.InteractionCreate, async (interaction) => await onInteraction(interaction));

// client.login(process.env.DISCORD_TOKEN)
import "reflect-metadata"
import "./utils/EnvValidation"
import { container } from "./container";
import { TYPES } from "./types";
import IClientService from "./services/discord/IClientService";
import ICommandService from "./services/discord/ICommandsService";
import { CommandList } from "./commands/_CommandList";
import IEventsService from "./services/discord/IEventsService";
import { onInteraction } from "./events/onInteraction";
import { onReady } from "./events/onReady";

const client = container.get<IClientService>(TYPES.ClientService);
const commands = container.get<ICommandService>(TYPES.CommandsService);
const events = container.get<IEventsService>(TYPES.EventsService);
commands.addCommands(CommandList);

events.addEvent("interactionCreate", onInteraction)
  .addEvent('ready', onReady);

client.login();
