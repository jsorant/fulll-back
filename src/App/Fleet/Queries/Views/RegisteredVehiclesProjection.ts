import { VehicleProjection } from "./VehicleProjection";

export class RegisteredVehiclesProjection {
  public readonly vehicles: Array<VehicleProjection>;

  constructor(vehicles: Array<VehicleProjection>) {
    this.vehicles = vehicles;
  }
}
