import { FleetProjections } from "./Ports/FleetProjections";
import { QueryHandler } from "../CqrsModel/QueryHandler";
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
    return this.ensureQueryIsValidThenGetFleet(query);
  }

  private async ensureQueryIsValidThenGetFleet(
    query: GetFleet
  ): Promise<FleetProjection> {
    if (query.fleetId !== undefined) {
      return await this.getFleetUsingFleetId(query.fleetId);
    }
    if (query.userId !== undefined) {
      return await this.getFleetUsingUserId(query.userId);
    }
    throw new Error("GetFleet query requires either a fleetId or a userId");
  }

  private async getFleetUsingFleetId(
    fleetId: string
  ): Promise<FleetProjection> {
    return await this.fleetProjections.getFleet(fleetId);
  }

  private async getFleetUsingUserId(userId: string): Promise<FleetProjection> {
    return await this.fleetProjections.getFleetForUser(userId);
  }
}
