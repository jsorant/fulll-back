import { FleetProjections } from "./Ports/FleetProjections";
import { QueryHandler } from "../../CqrsModel/QueryHandler";
import { LocateVehicle } from "./LocateVehicle";
import { LocationProjection } from "./Views/LocationProjection";

export class LocateVehicleHandler
  implements QueryHandler<LocateVehicle, LocationProjection>
{
  private projectionsPersistence: FleetProjections;

  constructor(projectionsPersistence: FleetProjections) {
    this.projectionsPersistence = projectionsPersistence;
  }

  async handle(query: LocateVehicle): Promise<LocationProjection> {
    return await this.projectionsPersistence.getVehicleLocationProjection(
      query.fleetId,
      query.plateNumber
    );
  }
}
