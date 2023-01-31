import { VehicleSnapshot } from "./ValueObjects/VehicleSnapshot";

export class FleetSnapshot {
  public readonly id: string;
  public readonly registeredVehicules: Array<VehicleSnapshot>;

  constructor(id: string, registeredVehicules: Array<VehicleSnapshot>) {
    this.id = id;
    this.registeredVehicules = registeredVehicules;
  }
}
