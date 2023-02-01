import { ProjectionsBuilder } from "./Ports/ProjectionsBuilder";
import { QueryHandler } from "../../CqrsModel/QueryHandler";
import { GetFleet } from "./GetFleet";
import { FleetProjection } from "./Views/FleetProjection";

export class GetFleetHandler
  implements QueryHandler<GetFleet, FleetProjection>
{
  private projectionsPersistence: ProjectionsBuilder;

  constructor(projectionsPersistence: ProjectionsBuilder) {
    this.projectionsPersistence = projectionsPersistence;
  }

  async handle(query: GetFleet): Promise<FleetProjection> {
    return await this.projectionsPersistence.buildFleetProjectionForUser(
      query.userId
    );
  }
}
