import { Command } from "../CqrsModel/Command";

export class CreateFleet implements Command {
  readonly fleetId: string;

  constructor(fleetId: string) {
    this.fleetId = fleetId;
  }
}
