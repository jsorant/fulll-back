import { FleetsRepository } from "../../../../App/Commands/Ports/FleetsRepository";
import { VehiclesRepository } from "../../../../App/Commands/Ports/VehiclesRepository";
import { FleetProjections } from "../../../../App/Queries/Ports/FleetProjections";
import { LocationProjections } from "../../../../App/Queries/Ports/LocationProjections";
import { Persistence } from "../Persistence";
import { InMemoryFleetProjections } from "./InMemoryFleetProjections";
import { InMemoryFleetsRepository } from "./InMemoryFleetsRepository";
import { InMemoryLocationProjections } from "./InMemoryLocationProjections";
import { InMemoryVehiclesRepository } from "./InMemoryVehiclesRepository";
import { SharedMemory } from "./SharedMemory";

export class InMemoryPersistence implements Persistence {
  private sharedMemory: SharedMemory = new SharedMemory();

  async reset(): Promise<void> {
    this.sharedMemory.reset();
  }

  getFleetsRepository(): FleetsRepository {
    return new InMemoryFleetsRepository(this.sharedMemory);
  }

  getVehiclesRepository(): VehiclesRepository {
    return new InMemoryVehiclesRepository(this.sharedMemory);
  }

  getFleetProjections(): FleetProjections {
    return new InMemoryFleetProjections(this.sharedMemory);
  }

  getLocationProjections(): LocationProjections {
    return new InMemoryLocationProjections(this.sharedMemory);
  }
}
