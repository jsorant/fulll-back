import { QueryHandler } from "../CqrsModel/QueryHandler";
import { LocationProjection } from "./Views/LocationProjection";
import { LocateVehicle } from "./LocateVehicle";
import { LocationProjections } from "./Ports/LocationProjections";

export class LocateVehicleHandler
  implements QueryHandler<LocateVehicle, LocationProjection>
{
  private locationProjections: LocationProjections;

  constructor(locationProjections: LocationProjections) {
    this.locationProjections = locationProjections;
  }

  async handle(query: LocateVehicle): Promise<LocationProjection> {
    return await this.locationProjections.getVehicleLocation(
      query.fleetId,
      query.plateNumber
    );
  }
}
