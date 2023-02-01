import { FleetProjection } from "../Views/FleetProjection";
import { VehiclesProjection } from "../Views/VehiclesProjection";
import { LocationProjection } from "../Views/LocationProjection";

export interface FleetProjections {
  getFleetProjectionForUser(userId: string): Promise<FleetProjection>;

  getVehiclesProjectionOfFleet(fleetId: string): Promise<VehiclesProjection>;

  getVehicleLocationProjection(
    fleetId: string,
    plateNumber: string
  ): Promise<LocationProjection>;
}
