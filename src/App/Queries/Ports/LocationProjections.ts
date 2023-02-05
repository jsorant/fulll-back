import { LocationProjection } from "../Views/LocationProjection";

export interface LocationProjections {
  getVehicleLocation(
    fleetId: string,
    plateNumber: string
  ): Promise<LocationProjection>;
}
