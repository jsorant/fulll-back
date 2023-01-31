import { Query } from "../../CqrsModel/Query";

export class ListRegisteredVehicles implements Query {
  public readonly fleetId: string;

  constructor(fleetId: string) {
    this.fleetId = fleetId;
  }
}
