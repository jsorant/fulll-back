import { VehicleProjection } from "./VehicleProjection";

export class RegisteredVehiclesProjection {
  public readonly vehicules: Array<VehicleProjection>;

  constructor(vehicules: Array<VehicleProjection>) {
    this.vehicules = vehicules;
  }
}
