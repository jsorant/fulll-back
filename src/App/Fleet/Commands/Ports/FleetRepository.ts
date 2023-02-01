import { Fleet } from "../../../../Domain/Fleet/Fleet";
import { Identifier } from "../../../../Domain/SharedKernel/Identifier";

export interface FleetRepository {
  hasFleetForUserId(userId: Identifier): Promise<boolean>;
  getFleet(id: Identifier): Promise<Fleet>;
  saveFleet(fleet: Fleet): Promise<void>;
}
