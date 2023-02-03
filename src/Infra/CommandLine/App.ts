import { FleetCommandLineController } from "./FleetCommandLineController";
import { InMemoryDataPersistence } from "../Fleet/InMemory/InMemoryFleetProjections";
import { Command } from "commander";
import { MongoDBFleetRepository } from "../Fleet/MongoDB/MongoDBFleetRepository";
import { MongoDBFleetProjections } from "../Fleet/MongoDB/MongoDBFleetProjections";
import { MongoDBFleetAdapter } from "../Fleet/MongoDB/FleetRepositoryAdapter";
import { FleetProjectionsAdapter } from "../Fleet/MongoDB/FleetProjectionsAdapter";

(async () => {
  try {
    await main();
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Error: ${(e as Error).message}`);
    } else {
      console.error(e);
    }
  } finally {
  }
})();

async function main() {
  const dataPersistence = new InMemoryDataPersistence();
  const uri = "mongodb://localhost:27017/fulll-backend";
  const adapter: MongoDBFleetAdapter = new MongoDBFleetAdapter();
  const adapter2: FleetProjectionsAdapter = new FleetProjectionsAdapter();
  const mongoDBFleetRepository = new MongoDBFleetRepository(uri, adapter);
  const mongoDBFleetProjections = new MongoDBFleetProjections(uri, adapter2);
  const controller = new FleetCommandLineController(
    mongoDBFleetRepository,
    mongoDBFleetProjections
  );

  const command: Command = new Command();

  command
    .name("fleet")
    .description("An application to manage a fleet of vehicles.");

  command
    .command("create")
    .description("Create the fleet of an user and return its identifier.")
    .argument("<userId>", "Identifier of the user.")
    .action(async (userId: string) => {
      const fleetId: string = await controller.createFleet(userId);
      console.log(`Fleet created. Fleet id: '${fleetId}'`);
    });

  command
    .command("register-vehicle")
    .description("Register a vehicle in a fleet.")
    .argument("<fleetId>", "Identifier of the fleet.")
    .argument(
      "<vehiclePlateNumber>",
      "Plate number of the vehicle to register."
    )
    .action(async (fleetId: string, vehiclePlateNumber: string) => {
      await controller.registerVehicle(fleetId, vehiclePlateNumber);
    });

  command
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
        await controller.parkVehicle(
          fleetId,
          vehiclePlateNumber,
          latitude,
          longitude,
          altitude
        );

        // TODO add dedicated command
        const location = await controller.locateVehicle(
          fleetId,
          vehiclePlateNumber
        );
        console.log(location);
      }
    );

  await command.parseAsync();
}
