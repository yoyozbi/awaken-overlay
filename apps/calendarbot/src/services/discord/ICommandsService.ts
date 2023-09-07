import { Command } from "../../interfaces/Command";
export default interface ICommandService {
  addCommand(command: Command): ICommandService;
  addCommands(commands: Command[]): ICommandService;
  getCommands(): Command[];
}
