import { Command } from "commander";
import { FleetCommandLineController } from "./FleetCommandLineController";

export class CommandLineParser {
  private controller: FleetCommandLineController;
  private command: Command;

  constructor(controller: FleetCommandLineController) {
    this.controller = controller;
    this.command = new Command();
    this.initialize;
  }

  async parse(): Promise<void> {
    console.log("t");
    this.command.parse(process.argv);
    console.log("t");
  }

  private initialize() {
    this.setupNameAndDescription();
    this.setupCreateCommand();
    this.setupRegisterVehicleCommand();
    this.setupParkVehicleCommand();
  }

  private setupNameAndDescription() {
    this.command
      .name("fleet")
      .description("An application to manage a fleet of vehicles.");
  }

  private setupCreateCommand() {
    this.command
      .command("create")
      .description("Create the fleet of an user and return its identifier.")
      .argument("<userId>", "Identifier of the user.")
      .action(this.onCreateCommand);
  }

  private async onCreateCommand(userId: string): Promise<void> {
    console.log(userId);
    const fleetId: string = await this.controller.createFleet(userId);
    console.log(fleetId);
  }

  private setupRegisterVehicleCommand() {
    this.command
      .command("register-vehicle")
      .description("Register a vehicle in a fleet.")
      .argument("<fleetId>", "Identifier of the fleet.")
      .argument(
        "<vehiclePlateNumber>",
        "Plate number of the vehicule to register."
      )
      .action(this.onRegisterVehicleCommand);
  }

  private async onRegisterVehicleCommand(
    fleetId: string,
    vehiclePlateNumber: string
  ): Promise<void> {
    console.log(fleetId);
    console.log(vehiclePlateNumber);
    fleetId = await this.controller.createFleet("totoID");

    await this.controller.registerVehicle(fleetId, vehiclePlateNumber);
  }

  private setupParkVehicleCommand() {
    this.command
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
      .action(this.onParkVehicleCommand);
  }

  private async onParkVehicleCommand(
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
    fleetId = await this.controller.createFleet("totoID");
    await this.controller.registerVehicle(fleetId, vehiclePlateNumber);

    await this.controller.parkVehicle(
      fleetId,
      vehiclePlateNumber,
      latitude,
      longitude,
      altitude
    );

    const location = await this.controller.locateVehicle(
      fleetId,
      vehiclePlateNumber
    );
    console.log(location);
  }
}
