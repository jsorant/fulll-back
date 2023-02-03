import { Query } from "../../CqrsModel/Query";

export class GetFleet implements Query {
  readonly fleetId?: string;
  readonly userId?: string;

  private constructor(fleetId?: string, userId?: string) {
    this.fleetId = fleetId;
    this.userId = userId;
  }

  static makeWithFleetId(fleetId: string): GetFleet {
    return new GetFleet(fleetId, undefined);
  }

  static makeWithUserId(userId: string): GetFleet {
    return new GetFleet(undefined, userId);
  }
}
