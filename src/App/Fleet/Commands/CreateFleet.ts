import { Command } from "../../CqrsModel/Command";

export class CreateFleet implements Command {
  readonly userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }
}
