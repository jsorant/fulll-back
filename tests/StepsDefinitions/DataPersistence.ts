import { InMemoryPersistence } from "../../src/Infra/Fleet/Persistence/InMemory/InMemoryPersistence";
import { Persistence } from "../../src/Infra/Fleet/Persistence/Persistence";

export function makePersistence(): Persistence {
  return new InMemoryPersistence();
}
