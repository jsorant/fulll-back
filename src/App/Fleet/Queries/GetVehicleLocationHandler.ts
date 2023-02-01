import { ProjectionsBuilder } from "./Ports/ProjectionsBuilder";
import { QueryHandler } from "../../CqrsModel/QueryHandler";
import { GetVehicleLocation } from "./GetVehicleLocation";
import { LocationProjection } from "./Views/LocationProjection";

export class GetVehicleLocationHandler
  implements QueryHandler<GetVehicleLocation, LocationProjection>
{
  private projectionsPersistence: ProjectionsBuilder;

  constructor(projectionsPersistence: ProjectionsBuilder) {
    this.projectionsPersistence = projectionsPersistence;
  }

  async handle(query: GetVehicleLocation): Promise<LocationProjection> {
    return await this.projectionsPersistence.buildVehicleLocationProjection(
      query.fleetId,
      query.plateNumber
    );
  }
}
