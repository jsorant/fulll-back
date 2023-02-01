import { Fleet } from "../../../../Domain/Fleet/Fleet";
import { Identifier } from "../../../../Domain/SharedKernel/Indentifier";

export interface FleetRepository {
  hasFleetForUserId(userId: Identifier): Promise<boolean>;
  getFleet(id: Identifier): Promise<Fleet>;
  saveFleet(fleet: Fleet): Promise<void>;
}
