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

async function main() {
  console.log("a");
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
  console.log("b");
}

main().then(() => console.log("done."));
