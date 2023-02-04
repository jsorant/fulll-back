import { Command } from "commander";
import { FleetController } from "./CommandLine/FleetController";
import { FleetsRepository } from "./src/App/Fleet/Commands/Ports/FleetsRepository";
import { VehiclesRepository } from "./src/App/Fleet/Commands/Ports/VehiclesRepository";
import { FleetProjections } from "./src/App/Fleet/Queries/Ports/FleetProjections";
import { LocationProjections } from "./src/App/Fleet/Queries/Ports/LocationProjections";
import { InMemoryFleetProjections } from "./src/Infra/Fleet/InMemory/InMemoryFleetProjections";
import { InMemoryFleetsRepository } from "./src/Infra/Fleet/InMemory/InMemoryFleetsRepository";
import { InMemoryLocationProjections } from "./src/Infra/Fleet/InMemory/InMemoryLocationProjections";
import { InMemoryVehiclesRepository } from "./src/Infra/Fleet/InMemory/InMemoryVehiclesRepository";
import { SharedMemory } from "./src/Infra/Fleet/InMemory/SharedMemory";

//TODO errors handler
//TODO locate vehicle
//TODO display vehicles of fleet

export class CommandLineParser {
  private command: Command;
  private controller: FleetController;

  constructor(controller: FleetController) {
    this.command = new Command();
    this.controller = controller;
  }

  async parse(): Promise<void> {
    this.addDescription();
    this.addCreateFleet();
    this.addRegisterVehicle();
    this.addLocalizeVehicle();
    await this.command.parseAsync();
  }

  private addDescription(): void {
    this.command
      .name("fleet")
      .description("An application to manage a fleet of vehicles.");
  }

  private addCreateFleet(): void {
    this.command
      .command("create")
      .description("Create the fleet of an user and return its identifier.")
      .argument("<userId>", "Identifier of the user.")
      .action(async (userId: string) => {
        await this.onCreateFleet(userId);
      });
  }

  private async onCreateFleet(userId: string): Promise<void> {
    const fleetId: string = await this.controller.createFleet(userId);
    console.log(`Fleet created. Fleet id: ${fleetId}`);
  }

  private addRegisterVehicle(): void {
    this.command
      .command("register-vehicle")
      .description("Register a vehicle in a fleet.")
      .argument("<fleetId>", "Identifier of the fleet.")
      .argument(
        "<vehiclePlateNumber>",
        "Plate number of the vehicle to register."
      )
      .action(async (fleetId: string, vehiclePlateNumber: string) => {
        await this.onRegisterVehicle(fleetId, vehiclePlateNumber);
      });
  }

  private async onRegisterVehicle(
    fleetId: string,
    vehiclePlateNumber: string
  ): Promise<void> {
    // TO REMOVE
    fleetId = await this.controller.createFleet("alice");

    await this.controller.registerVehicle(fleetId, vehiclePlateNumber);
    console.log(`Vehicle registered.`);
  }

  private addLocalizeVehicle(): void {
    this.command
      .command("localize-vehicle")
      .description("Localize a vehicle to a given location.")
      .argument("<fleetId>", "Identifier of the fleet.")
      .argument(
        "<vehiclePlateNumber>",
        "Plate number of the vehiule to register."
      )
      .argument("<latitude>", "Latitude of the location.")
      .argument("<longitude>", "Longitude of the location.")
      .argument("[altitude]", "Altitude of the location.")
      .action(
        async (
          fleetId: string,
          vehiclePlateNumber: string,
          latitude: string,
          longitude: string,
          altitude: string
        ) => {
          await this.onLocalizeVehicle(
            fleetId,
            vehiclePlateNumber,
            latitude,
            longitude,
            altitude
          );
        }
      );
  }

  private async onLocalizeVehicle(
    fleetId: string,
    vehiclePlateNumber: string,
    latitude: string,
    longitude: string,
    altitude: string
  ): Promise<void> {
    // TO REMOVE
    fleetId = await this.controller.createFleet("alice");
    await this.controller.registerVehicle(fleetId, vehiclePlateNumber);

    await this.controller.parkVehicle(
      fleetId,
      vehiclePlateNumber,
      latitude,
      longitude,
      altitude
    );

    // TODO split in dedicated command
    const location = await this.controller.locateVehicle(
      fleetId,
      vehiclePlateNumber
    );
    console.log("Vehicle localized.");
    console.log("Location:", location);
  }
}

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
