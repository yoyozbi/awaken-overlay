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
import "./utils/EnvValidation"
import { container } from "./container";
import { TYPES } from "./types";
import IClientService from "./services/discord/IClientService";

const client = container.get<IClientService>(TYPES.ClientService);

client.login();
