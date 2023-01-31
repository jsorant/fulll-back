import { ProjectionsPersistence } from "./Ports/ProjectionsPersistence";
import { QueryHandler } from "../../CqrsModel/QueryHandler";
import { GetVehiculeLocation } from "./GetVehiculeLocation";
import { VehicleLocationProjection } from "./Views/VehiculeLocationProjection";

export class GetVehiculeLocationHandler
  implements QueryHandler<GetVehiculeLocation, VehicleLocationProjection>
{
  private projectionsPersistence: ProjectionsPersistence;

  constructor(projectionsPersistence: ProjectionsPersistence) {
    this.projectionsPersistence = projectionsPersistence;
  }

  async execute(
    query: GetVehiculeLocation
  ): Promise<VehicleLocationProjection> {
    return await this.projectionsPersistence.getVehicleLocationProjection(
      query.fleetId,
      query.plateNumber
    );
  }
}
