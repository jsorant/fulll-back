import { FleetProjections } from "./Ports/FleetProjections";
import { QueryHandler } from "../../CqrsModel/QueryHandler";
import { ListVehicles } from "./ListVehicles";
import { VehiclesProjection } from "./Views/VehiclesProjection";

export class ListVehiclesHandler
  implements QueryHandler<ListVehicles, VehiclesProjection>
{
  private projectionsPersistence: FleetProjections;

  constructor(projectionsPersistence: FleetProjections) {
    this.projectionsPersistence = projectionsPersistence;
  }

  async handle(query: ListVehicles): Promise<VehiclesProjection> {
    return await this.projectionsPersistence.getVehiclesProjectionOfFleet(
      query.fleetId
    );
  }
}
