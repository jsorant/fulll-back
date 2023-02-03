import { SharedMemory } from "./SharedMemory";
import { FleetsRepository } from "../../../App/Fleet/Commands/Ports/FleetsRepository";
import { Fleet } from "../../../Domain/Fleet/Fleet";

export class InMemoryFleetsRepository implements FleetsRepository {
  private sharedMemory: SharedMemory;

  constructor(sharedMemory: SharedMemory) {
    this.sharedMemory = sharedMemory;
  }

  async hasForUserId(userId: string): Promise<boolean> {
    return this.sharedMemory.findFleetFromUserId(userId) !== undefined;
  }

  async get(id: string): Promise<Fleet> {
    return this.sharedMemory.findFleetOrThrow(id);
  }

  async save(fleet: Fleet): Promise<void> {
    this.sharedMemory.removeFleet(fleet.id.value);
    this.sharedMemory.addFleet(fleet);
  }
}
