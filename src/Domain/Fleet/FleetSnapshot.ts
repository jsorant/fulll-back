import { VehicleSnapshot } from "./Entities/VehicleSnapshot";

export class FleetSnapshot {
  public readonly id: string;
  public readonly vehicles: Array<VehicleSnapshot>;

  constructor(id: string, vehicles: Array<VehicleSnapshot>) {
    this.id = id;
    this.vehicles = vehicles;
  }
}
