import { FleetProjection } from "../Views/FleetProjection";
import { LocationProjection } from "../Views/LocationProjection";

export interface FleetProjections {
  //TODO split in two classes
  getFleetForUser(userId: string): Promise<FleetProjection>;

  getFleet(fleetId: string): Promise<FleetProjection>;

  getVehicleLocation(
    fleetId: string,
    plateNumber: string
  ): Promise<LocationProjection>;
}
