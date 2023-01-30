import { Command } from "../CqrsModel/Command";

export class RegisterVehicle implements Command {
  public readonly fleetId: string;
  public readonly plate: string;

  constructor(plate: string, fleetId: string) {
    this.fleetId = fleetId;
    this.plate = plate;
  }
}
