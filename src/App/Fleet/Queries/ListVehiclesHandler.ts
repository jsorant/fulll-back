import { ProjectionsPersistence } from "./Ports/ProjectionsPersistence";
import { QueryHandler } from "../../CqrsModel/QueryHandler";
import { ListRegisteredVehicles } from "./ListVehicles";
import { RegisteredVehiclesProjection } from "./Views/RegisteredVehiclesProjection";

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
    return await this.projectionsPersistence.getRegisteredVehiclesProjection(
      query.fleetId
    );
  }
}
