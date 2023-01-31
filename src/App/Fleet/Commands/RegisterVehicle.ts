import { Command } from "../../CqrsModel/Command";

export class RegisterVehicle implements Command {
  public readonly fleetId: string;
  public readonly plateNumber: string;

  constructor(plateNumber: string, fleetId: string) {
    this.fleetId = fleetId;
    this.plateNumber = plateNumber;
  }
}
