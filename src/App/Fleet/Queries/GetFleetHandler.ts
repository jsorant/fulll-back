import { FleetProjections } from "./Ports/FleetProjections";
import { QueryHandler } from "../../CqrsModel/QueryHandler";
import { GetFleet } from "./GetFleet";
import { FleetProjection } from "./Views/FleetProjection";

export class GetFleetHandler
  implements QueryHandler<GetFleet, FleetProjection>
{
  private fleetProjections: FleetProjections;

  constructor(fleetProjections: FleetProjections) {
    this.fleetProjections = fleetProjections;
  }

  async handle(query: GetFleet): Promise<FleetProjection> {
    return this.ensureQueryIsValidThenHandleQuery(query);
  }

  private async ensureQueryIsValidThenHandleQuery(
    query: GetFleet
  ): Promise<FleetProjection> {
    if (query.fleetId !== undefined) {
      return await this.makeProjectionUsingFleetId(query.fleetId);
    }
    if (query.userId !== undefined) {
      return await this.makeProjectionUsingUserId(query.userId);
    }
    throw new Error("GetFleet query requires either a fleetId or a userId");
  }

  private async makeProjectionUsingFleetId(
    fleetId: string
  ): Promise<FleetProjection> {
    return await this.fleetProjections.getFleet(fleetId);
  }

  private async makeProjectionUsingUserId(
    userId: string
  ): Promise<FleetProjection> {
    return await this.fleetProjections.getFleetForUser(userId);
  }
}
