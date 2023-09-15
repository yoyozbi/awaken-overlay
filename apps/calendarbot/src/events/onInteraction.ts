import { injectable, multiInject } from "inversify";
import type { CacheType, Interaction } from "discord.js";
import type Event from "../interfaces/Event"

import { TYPES } from "../types";
import { Command } from "../interfaces/Command";

@injectable()
export default class InteractionEvent implements Event<"interactionCreate"> {
  commands: Command[];

  public name: "interactionCreate" = "interactionCreate";

  constructor(@multiInject(TYPES.Commands) commands: Command[]) {
    this.commands = commands;
  }

  async run(interaction: Interaction<CacheType>): Promise<void> {
    if (!interaction.isCommand()) {
      return;
    }

    for (const command of this.commands) {
      if (interaction.commandName == command.getData().name) {
        await command.run(interaction);
        break;
      }
    }
  }
}
