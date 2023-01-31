import { RegisteredVehiclesProjection } from "../Views/RegisteredVehiclesProjection";
import { VehicleLocationProjection } from "../Views/VehiculeLocationProjection";

export interface ProjectionsPersistence {
  getRegisteredVehiclesProjection(
    fleetId: string
  ): Promise<RegisteredVehiclesProjection>;

  getVehicleLocationProjection(
    fleetId: string,
    plateNumber: string
  ): Promise<VehicleLocationProjection>;
}
