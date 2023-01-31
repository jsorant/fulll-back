import { VehicleSnapshot } from "./Entities/VehicleSnapshot";

export class FleetSnapshot {
  public readonly id: string;
  public readonly registeredVehicles: Array<VehicleSnapshot>;

  constructor(id: string, registeredVehicles: Array<VehicleSnapshot>) {
    this.id = id;
    this.registeredVehicles = registeredVehicles;
  }
}
