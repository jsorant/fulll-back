import { FleetProjections } from "./Ports/FleetProjections";
import { QueryHandler } from "../../CqrsModel/QueryHandler";
import { GetFleet } from "./GetFleet";
import { FleetProjection } from "./Views/FleetProjection";

export class GetFleetHandler
  implements QueryHandler<GetFleet, FleetProjection>
{
  private projectionsPersistence: FleetProjections;

  constructor(projectionsPersistence: FleetProjections) {
    this.projectionsPersistence = projectionsPersistence;
  }

  async handle(query: GetFleet): Promise<FleetProjection> {
    return await this.projectionsPersistence.getFleetProjectionForUser(
      query.userId
    );
  }
}
