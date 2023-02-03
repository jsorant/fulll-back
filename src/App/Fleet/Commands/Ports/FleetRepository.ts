import { Fleet } from "../../../../Domain/Fleet/Fleet";

export interface FleetsRepository {
  hasForUserId(userId: string): Promise<boolean>;
  get(id: string): Promise<Fleet>;
  save(fleet: Fleet): Promise<void>;
}
