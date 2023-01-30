import { VehicleProjection } from "../Views/VehicleProjection";

export interface ProjectionsPersistence {
  getVehiculeListProjection(fleetId: string): Promise<Array<VehicleProjection>>;
}
