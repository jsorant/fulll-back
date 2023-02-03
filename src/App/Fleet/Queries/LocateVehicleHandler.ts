import { FleetProjections } from "./Ports/FleetProjections";
import { QueryHandler } from "../../CqrsModel/QueryHandler";
import { LocateVehicle } from "./LocateVehicle";
import { LocationProjection } from "./Views/LocationProjection";

export class LocateVehicleHandler
  implements QueryHandler<LocateVehicle, LocationProjection>
{
  private fleetProjections: FleetProjections;

  constructor(fleetProjections: FleetProjections) {
    this.fleetProjections = fleetProjections;
  }

  async handle(query: LocateVehicle): Promise<LocationProjection> {
    return await this.fleetProjections.getVehicleLocation(
      query.fleetId,
      query.plateNumber
    );
  }
}
