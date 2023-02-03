import { FleetsRepository } from "../../src/App/Fleet/Commands/Ports/FleetsRepository";
import { VehiclesRepository } from "../../src/App/Fleet/Commands/Ports/VehiclesRepository";
import { FleetProjections } from "../../src/App/Fleet/Queries/Ports/FleetProjections";
import { LocationProjections } from "../../src/App/Fleet/Queries/Ports/LocationProjections";
import { InMemoryFleetProjections } from "../../src/Infra/Fleet/InMemory/InMemoryFleetProjections";
import { InMemoryFleetsRepository } from "../../src/Infra/Fleet/InMemory/InMemoryFleetsRepository";
import { InMemoryLocationProjections } from "../../src/Infra/Fleet/InMemory/InMemoryLocationProjections";
import { InMemoryVehiclesRepository } from "../../src/Infra/Fleet/InMemory/InMemoryVehiclesRepository";
import { SharedMemory } from "../../src/Infra/Fleet/InMemory/SharedMemory";

export interface DataPersistenceObjects {
  fleetsRepository: FleetsRepository;
  vehiclesRepository: VehiclesRepository;
  fleetProjections: FleetProjections;
  locationProjections: LocationProjections;
}

export function makeDataPersistence(): DataPersistenceObjects {
  SharedMemory.reset();
  return {
    fleetsRepository: new InMemoryFleetsRepository(new SharedMemory()),
    vehiclesRepository: new InMemoryVehiclesRepository(new SharedMemory()),
    fleetProjections: new InMemoryFleetProjections(new SharedMemory()),
    locationProjections: new InMemoryLocationProjections(new SharedMemory()),
  };
}
