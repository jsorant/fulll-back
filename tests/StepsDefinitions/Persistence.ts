import { InMemoryPersistence } from "../../src/Infra/Fleet/Persistence/InMemory/InMemoryPersistence";
import { Persistence } from "../../src/Infra/Fleet/Persistence/Persistence";
import { Sqlite3Persistence } from "../../src/Infra/Fleet/Persistence/SqlLite3/Sqlite3Persistence";

export async function makePersistence(): Promise<Persistence> {
  //TODO SWITCH
  //const persistence: Persistence = new InMemoryPersistence();
  const persistence: Persistence = new Sqlite3Persistence("fleets-test.db");
  await persistence.reset();
  return persistence;
}
