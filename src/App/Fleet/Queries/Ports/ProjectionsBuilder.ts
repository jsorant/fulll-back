import { FleetProjection } from "../Views/FleetProjection";
import { VehiclesProjection } from "../Views/VehiclesProjection";
import { LocationProjection } from "../Views/LocationProjection";

export interface ProjectionsBuilder {
  buildFleetProjectionForUser(userId: string): Promise<FleetProjection>;

  buildVehiclesProjectionOfFleet(fleetId: string): Promise<VehiclesProjection>;

  buildVehicleLocationProjection(
    fleetId: string,
    plateNumber: string
  ): Promise<LocationProjection>;
}
