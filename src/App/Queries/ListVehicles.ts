import { Query } from "../CqrsModel/Query";

export class ListVehicles implements Query {
  public readonly fleetId: string;

  constructor(fleetId: string) {
    this.fleetId = fleetId;
  }
}
