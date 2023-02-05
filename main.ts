import { FleetController } from "./src/Infra/Fleet/FleetController";
import { FleetsRepository } from "./src/App/Fleet/Commands/Ports/FleetsRepository";
import { VehiclesRepository } from "./src/App/Fleet/Commands/Ports/VehiclesRepository";
import { FleetProjections } from "./src/App/Fleet/Queries/Ports/FleetProjections";
import { LocationProjections } from "./src/App/Fleet/Queries/Ports/LocationProjections";
import { InMemoryFleetProjections } from "./src/Infra/Fleet/Persistence/InMemory/InMemoryFleetProjections";
import { InMemoryFleetsRepository } from "./src/Infra/Fleet/Persistence/InMemory/InMemoryFleetsRepository";
import { InMemoryLocationProjections } from "./src/Infra/Fleet/Persistence/InMemory/InMemoryLocationProjections";
import { InMemoryVehiclesRepository } from "./src/Infra/Fleet/Persistence/InMemory/InMemoryVehiclesRepository";
import { SharedMemory } from "./src/Infra/Fleet/Persistence/InMemory/SharedMemory";
import { CommandLineParser } from "./src/Infra/Fleet/CommandLine/CommandLineParser";
import { Sqlite3Database } from "./src/Infra/Fleet/Persistence/SqlLite3/Sqlite3Database";
import { FleetTable } from "./src/Infra/Fleet/Persistence/SqlLite3/Tables/FleetTable";
import { FleetVehiclesTable } from "./src/Infra/Fleet/Persistence/SqlLite3/Tables/FleetVehiclesTable";
import { VehicleTable } from "./src/Infra/Fleet/Persistence/SqlLite3/Tables/VehicleTable";
import { VehicleFleetsTable } from "./src/Infra/Fleet/Persistence/SqlLite3/Tables/VehicleFleetsTable";
import { VehicleLocationTable } from "./src/Infra/Fleet/Persistence/SqlLite3/Tables/VehicleLocationTable";
import { Sqlite3FleetsRepository } from "./src/Infra/Fleet/Persistence/SqlLite3/Sqlite3FleetsRepository";
import { Fleet } from "./src/Domain/Fleet/Fleet";
import { Sqlite3VehiclesRepository } from "./src/Infra/Fleet/Persistence/SqlLite3/Sqlite3VehiclesRepository";
import { Vehicle } from "./src/Domain/Vehicle/Vehicle";
import { Sqlite3FleetProjections } from "./src/Infra/Fleet/Persistence/SqlLite3/Sqlite3FleetProjections";
import { Sqlite3LocationProjections } from "./src/Infra/Fleet/Persistence/SqlLite3/Sqlite3LocationProjections";

async function cmd() {
  const sharedMemory: SharedMemory = new SharedMemory();
  const fleetsRepository: FleetsRepository = new InMemoryFleetsRepository(
    sharedMemory
  );
  const vehiclesRepository: VehiclesRepository = new InMemoryVehiclesRepository(
    sharedMemory
  );
  const fleetProjections: FleetProjections = new InMemoryFleetProjections(
    sharedMemory
  );
  const locationProjections: LocationProjections =
    new InMemoryLocationProjections(sharedMemory);
  const controller: FleetController = new FleetController(
    fleetsRepository,
    vehiclesRepository,
    fleetProjections,
    locationProjections
  );
  const parser: CommandLineParser = new CommandLineParser(controller);
  await parser.parse();
}

async function cmd2() {
  const tables = [
    new FleetTable(),
    new FleetVehiclesTable(),
    new VehicleTable(),
    new VehicleFleetsTable(),
    new VehicleLocationTable(),
  ];
  const db = new Sqlite3Database("fleets.db", tables);
  const fleets = new Sqlite3FleetsRepository(db);
  const vehicles = new Sqlite3VehiclesRepository(db);
  const fleetProjections = new Sqlite3FleetProjections(db);
  const locationProjections = new Sqlite3LocationProjections(db);

  const controller: FleetController = new FleetController(
    fleets,
    vehicles,
    fleetProjections,
    locationProjections
  );
  const parser: CommandLineParser = new CommandLineParser(controller);
  await parser.parse();
}

async function main() {
  console.log("a");
  const tables = [
    new FleetTable(),
    new FleetVehiclesTable(),
    new VehicleTable(),
    new VehicleFleetsTable(),
    new VehicleLocationTable(),
  ];
  const db = new Sqlite3Database("fleets.db", tables);
  await db.reset();
  //await db.reset();
  //await db.run("INSERT INTO fleet (id, user_id) VALUES ('ID1', 'Alice')");
  const fleets = new Sqlite3FleetsRepository(db);
  await fleets.save(Fleet.createFrom("fID1", "uAlice", ["vID1", "vID2"]));
  await fleets.save(Fleet.createFrom("fID1", "uAlice", ["vID1"]));
  await fleets.save(Fleet.createFrom("fID2", "uBob", ["vID3", "vID4"]));
  //  await db.run("INSERT INTO fleet (id, user_id) VALUES ('ID2', 'Bob')");

  const vehicles = new Sqlite3VehiclesRepository(db);
  await vehicles.save(Vehicle.createFrom("vID1", "plID1", ["fID1"]));
  await vehicles.save(Vehicle.createFrom("vID2", "plID2", ["fID1"], 60, 90));
  await vehicles.save(Vehicle.createFrom("vID2", "plID2", ["fID1"], 60, 50));
  await vehicles.save(
    Vehicle.createFrom("vID3", "plID3", ["fID2"], 60, 90, 1000)
  );
  await vehicles.save(Vehicle.createFrom("vID4", "plID4", ["fID2"]));
  await vehicles.save(Vehicle.createFrom("vID4", "plID4", ["fID2"], 60, 90));

  console.log(await fleets.hasForUserId("uAlice"));
  console.log(await fleets.hasForUserId("uDave"));
  console.log(await fleets.get("fID1"));
  console.log(await fleets.get("fID2"));

  console.log(await vehicles.get("vID1"));
  console.log(await vehicles.get("vID2"));
  console.log(await vehicles.get("vID3"));
  console.log(await vehicles.get("vID4"));

  console.log("plate", await vehicles.getFromPlateNumber("plID1"));
  console.log("plate", await vehicles.getFromPlateNumber("plID2"));
  console.log("plate", await vehicles.getFromPlateNumber("plID3"));
  console.log("plate", await vehicles.getFromPlateNumber("plID4"));

  const fleetProjections = new Sqlite3FleetProjections(db);
  console.log("fp", await fleetProjections.getFleet("fID1"));
  console.log("fp", await fleetProjections.getFleet("fID2"));

  console.log("fp2", await fleetProjections.getFleetForUser("uAlice"));
  console.log("fp2", await fleetProjections.getFleetForUser("uBob"));

  const locationProjections = new Sqlite3LocationProjections(db);
  console.log(
    "loc",
    await locationProjections.getVehicleLocation("toto", "plID2")
  );
  console.log(
    "loc",
    await locationProjections.getVehicleLocation("toto", "plID3")
  );
}

cmd2().then(() => {});
