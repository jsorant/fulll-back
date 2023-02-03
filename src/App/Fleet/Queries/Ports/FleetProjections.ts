import { FleetProjection } from "../Views/FleetProjection";
import { LocationProjection } from "../Views/LocationProjection";

export interface FleetProjections {
  getFleetForUser(userId: string): Promise<FleetProjection>;

  getFleet(fleetId: string): Promise<FleetProjection>;

  getVehicleLocation(
    fleetId: string,
    plateNumber: string
  ): Promise<LocationProjection>;
}
