import { Command } from "./Command";

export interface CommandHandler<TCommand extends Command> {
  execute(command: TCommand): Promise<void>;
}
