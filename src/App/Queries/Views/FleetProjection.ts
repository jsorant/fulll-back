import { VehicleProjection } from "./VehicleProjection";

export interface FleetProjection {
  id: string;
  vehicles: Array<VehicleProjection>;
}
