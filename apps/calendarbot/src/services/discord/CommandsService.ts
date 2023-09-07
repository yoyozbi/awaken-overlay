import { injectable } from "inversify";
import { Command } from "../../interfaces/Command";
import ICommandService from "./ICommandsService";

@injectable()
export default class CommandsService implements ICommandService {
  private commands: Command[];
  public constructor() {
    this.commands = [];
  }

  addCommand(command: Command): ICommandService {
    this.commands.push(command);
    return this;
  }

  addCommands(commands: Command[]): ICommandService {
    this.commands.push.apply(this.commands, commands);
    return this;
  }

  getCommands(): Command[] {
    return this.commands;
  }
}
