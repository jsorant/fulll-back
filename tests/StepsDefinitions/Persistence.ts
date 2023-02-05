import { InMemoryPersistence } from "../../src/Infra/Fleet/Persistence/InMemory/InMemoryPersistence";
import { Persistence } from "../../src/Infra/Fleet/Persistence/Persistence";
import { Sqlite3Persistence } from "../../src/Infra/Fleet/Persistence/SqlLite3/Sqlite3Persistence";

const TEST_DATABASE_FILE_PATH: string = "fleets-test.db";

export async function createForcedOrSqlite3Persistence(
  world: any
): Promise<void> {
  const param: string = world.parameters.fleetPersistenceType;
  if (param !== undefined && param === "inmemory") {
    await setupInMemoryPersistence(world);
  } else {
    await setupSqlite3Persistence(world);
  }
}

export async function createForcedOrInMemoryPersistence(
  world: any
): Promise<void> {
  const param: string = world.parameters.fleetPersistenceType;
  if (param !== undefined && param === "sqlite3") {
    await setupSqlite3Persistence(world);
  } else {
    await setupInMemoryPersistence(world);
  }
}

async function setupSqlite3Persistence(world: any): Promise<void> {
  const persistence: Persistence = await createSqlite3Persistence();
  await setupWorldWithPersistence(world, persistence);
}

async function setupInMemoryPersistence(world: any): Promise<void> {
  const persistence: Persistence = await createInMemoryPersistence();
  await setupWorldWithPersistence(world, persistence);
}

async function setupWorldWithPersistence(
  world: any,
  persistence: Persistence
): Promise<void> {
  world.fleetsRepository = persistence.getFleetsRepository();
  world.vehiclesRepository = persistence.getVehiclesRepository();
  world.fleetProjections = persistence.getFleetProjections();
  world.locationProjections = persistence.getLocationProjections();
}

async function createSqlite3Persistence(): Promise<Persistence> {
  const persistence: Persistence = new Sqlite3Persistence(
    TEST_DATABASE_FILE_PATH
  );
  await persistence.reset();
  return persistence;
}

async function createInMemoryPersistence(): Promise<Persistence> {
  const persistence: Persistence = new InMemoryPersistence();
  await persistence.reset();
  return persistence;
}
