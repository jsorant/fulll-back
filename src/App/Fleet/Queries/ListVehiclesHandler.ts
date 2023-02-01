import { ProjectionsBuilder } from "./Ports/ProjectionsBuilder";
import { QueryHandler } from "../../CqrsModel/QueryHandler";
import { ListVehicles } from "./ListVehicles";
import { VehiclesProjection } from "./Views/VehiclesProjection";

export class ListVehiclesHandler
  implements QueryHandler<ListVehicles, VehiclesProjection>
{
  private projectionsPersistence: ProjectionsBuilder;

  constructor(projectionsPersistence: ProjectionsBuilder) {
    this.projectionsPersistence = projectionsPersistence;
  }

  async handle(query: ListVehicles): Promise<VehiclesProjection> {
    return await this.projectionsPersistence.buildVehiclesProjectionOfFleet(
      query.fleetId
    );
  }
}
