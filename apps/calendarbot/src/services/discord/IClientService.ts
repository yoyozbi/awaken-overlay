import type { Client as DiscordClient } from "discord.js"
export default interface Client {
  getClient(): DiscordClient;
  login(): void;
}
