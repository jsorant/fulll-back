import { FleetCommandLineController } from "./FleetCommandLineController";
import { InMemoryDataPersistence } from "../Fleet/InMemoryFleetRepository";
import { Command } from "commander";

const dataPersistence = new InMemoryDataPersistence();
const controller = new FleetCommandLineController(
  dataPersistence,
  dataPersistence
);

const command: Command = new Command();

function initialize() {
  setupNameAndDescription();
  setupCreateCommand();
  setupRegisterVehicleCommand();
  setupParkVehicleCommand();
}

function setupNameAndDescription() {
  command
    .name("fleet")
    .description("An application to manage a fleet of vehicles.");
}

function setupCreateCommand() {
  command
    .command("create")
    .description("Create the fleet of an user and return its identifier.")
    .argument("<userId>", "Identifier of the user.")
    .action(onCreateCommand);
}

async function onCreateCommand(userId: string): Promise<void> {
  console.log(userId);
  const fleetId: string = await controller.createFleet(userId);
  console.log(fleetId);
}

function setupRegisterVehicleCommand() {
  command
    .command("register-vehicle")
    .description("Register a vehicle in a fleet.")
    .argument("<fleetId>", "Identifier of the fleet.")
    .argument(
      "<vehiclePlateNumber>",
      "Plate number of the vehicule to register."
    )
    .action(onRegisterVehicleCommand);
}

async function onRegisterVehicleCommand(
  fleetId: string,
  vehiclePlateNumber: string
): Promise<void> {
  console.log(fleetId);
  console.log(vehiclePlateNumber);
  fleetId = await controller.createFleet("totoID");

  await controller.registerVehicle(fleetId, vehiclePlateNumber);
}

function setupParkVehicleCommand() {
  command
    .command("park-vehicle")
    .description("Park a vehicle to a given location.")
    .argument("<fleetId>", "Identifier of the fleet.")
    .argument(
      "<vehiclePlateNumber>",
      "Plate number of the vehicule to register."
    )
    .argument("<latitude>", "Latitude of the location.")
    .argument("<longitude>", "Longitude of the location.")
    .argument("[altitude]", "Altitude of the location.")
    .action(onParkVehicleCommand);
}

async function onParkVehicleCommand(
  fleetId: string,
  vehiclePlateNumber: string,
  latitude: string,
  longitude: string,
  altitude: string
): Promise<void> {
  console.log(fleetId);
  console.log(vehiclePlateNumber);
  console.log(latitude);
  console.log(longitude);
  console.log(altitude);
  fleetId = await controller.createFleet("totoID");
  await controller.registerVehicle(fleetId, vehiclePlateNumber);

  await controller.parkVehicle(
    fleetId,
    vehiclePlateNumber,
    latitude,
    longitude,
    altitude
  );

  const location = await controller.locateVehicle(fleetId, vehiclePlateNumber);
  console.log(location);
}

initialize();
command.parse();
