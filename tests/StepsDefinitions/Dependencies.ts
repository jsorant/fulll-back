import { FleetRepository } from "../../src/App/Fleet/Commands/Ports/FleetRepository";
import { ProjectionsBuilder } from "../../src/App/Fleet/Queries/Ports/ProjectionsBuilder";
import { InMemoryDataPersistence } from "../../src/Infra/Fleet/InMemoryFleetRepository";

export function makeDataPersistence(): FleetRepository & ProjectionsBuilder {
  return new InMemoryDataPersistence();
}
