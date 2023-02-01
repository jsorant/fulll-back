import { Query } from "../../CqrsModel/Query";

export class LocateVehicle implements Query {
  readonly fleetId: string;
  readonly plateNumber: string;

  constructor(fleetId: string, plateNumber: string) {
    this.fleetId = fleetId;
    this.plateNumber = plateNumber;
  }
}
