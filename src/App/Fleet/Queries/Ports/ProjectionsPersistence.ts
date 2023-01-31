import { RegisteredVehiclesProjection } from "../Views/RegisteredVehiculesProjection";

export interface ProjectionsPersistence {
  getRegisteredVehiculesProjection(
    fleetId: string
  ): Promise<RegisteredVehiclesProjection>;
}
