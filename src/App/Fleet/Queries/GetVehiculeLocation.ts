import { Query } from "../../CqrsModel/Query";

export class GetVehiculeLocation implements Query {
  public readonly fleetId: string;
  public readonly plateNumber: string;

  constructor(fleetId: string, plateNumber: string) {
    this.fleetId = fleetId;
    this.plateNumber = plateNumber;
  }
}
