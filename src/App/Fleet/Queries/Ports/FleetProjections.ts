import { FleetProjection } from "../Views/FleetProjection";

export interface FleetProjections {
  getFleetForUser(userId: string): Promise<FleetProjection>;
  getFleet(fleetId: string): Promise<FleetProjection>;
}
