import { Command } from "../../CqrsModel/Command";

export class RegisterVehicle implements Command {
  readonly plateNumber: string;
  readonly fleetId: string;

  constructor(plateNumber: string, fleetId: string) {
    this.plateNumber = plateNumber;
    this.fleetId = fleetId;
  }
}
