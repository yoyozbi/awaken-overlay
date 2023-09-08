import { ClientEvents } from "discord.js";

export default interface Event<E extends keyof ClientEvents> {
  name: E;
  run(...args: ClientEvents[E]): Promise<void>;
}
