import { Fleet } from "../../../../Domain/Fleet/Fleet";

export interface FleetRepository {
  getFleet(id: string): Promise<Fleet>;
  saveFleet(fleet: Fleet): Promise<void>;
}
