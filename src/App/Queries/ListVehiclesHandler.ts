import { ProjectionsPersistence } from "./Ports/ProjectionsPersistence";
import { QueryHandler } from "../CqrsModel/QueryHandler";
import { ListVehicles } from "./ListVehicles";
import { VehicleProjection } from "./Views/VehicleProjection";

export class ListVehiclesHandler
  implements QueryHandler<ListVehicles, Array<VehicleProjection>>
{
  private projectionsPersistence: ProjectionsPersistence;

  constructor(projectionsPersistence: ProjectionsPersistence) {
    this.projectionsPersistence = projectionsPersistence;
  }

  async execute(query: ListVehicles): Promise<Array<VehicleProjection>> {
    return await this.projectionsPersistence.getVehiculeListProjection(
      query.fleetId
    );
  }
}
