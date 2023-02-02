import { FleetRepository } from "../../src/App/Fleet/Commands/Ports/FleetRepository";
import { FleetProjections } from "../../src/App/Fleet/Queries/Ports/FleetProjections";
import { InMemoryDataPersistence } from "../../src/Infra/Fleet/InMemory/InMemoryDataPersistence";

export interface DataPersistenceObjects {
  fleetRepository: FleetRepository;
  projectionsBuilder: FleetProjections;
}

export function makeDataPersistence(): DataPersistenceObjects {
  const dataPersistence: InMemoryDataPersistence =
    new InMemoryDataPersistence();
  return {
    fleetRepository: dataPersistence,
    projectionsBuilder: dataPersistence,
  };
}
