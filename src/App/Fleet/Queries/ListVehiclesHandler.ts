import { ProjectionsPersistence } from "./Ports/ProjectionsPersistence";
import { QueryHandler } from "../../CqrsModel/QueryHandler";
import { ListRegisteredVehicles } from "./ListVehicles";
import { RegisteredVehiclesProjection } from "./Views/RegisteredVehiculesProjection";

export class ListRegisteredVehiclesHandler
  implements QueryHandler<ListRegisteredVehicles, RegisteredVehiclesProjection>
{
  private projectionsPersistence: ProjectionsPersistence;

  constructor(projectionsPersistence: ProjectionsPersistence) {
    this.projectionsPersistence = projectionsPersistence;
  }

  async execute(
    query: ListRegisteredVehicles
  ): Promise<RegisteredVehiclesProjection> {
    return await this.projectionsPersistence.getRegisteredVehiculesProjection(
      query.fleetId
    );
  }
}
