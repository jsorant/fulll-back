import { Command } from "commander";
import { FleetProjection } from "../../App/Queries/Views/FleetProjection";
import { LocationProjection } from "../../App/Queries/Views/LocationProjection";
import { FleetController } from "../FleetController";

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
    this.addDisplayFleet();
    this.addRegisterVehicle();
    this.addLocalizeVehicle();
    this.addLocateVehicle();
    await this.parseWithErrorHandling();
  }

  private addDescription(): void {
    this.command
      .name("fleet")
      .description("An application to manage fleets of vehicles.");
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

  private addDisplayFleet(): void {
    this.command
      .command("display")
      .description("Display a fleet.")
      .argument("<fleetId>", "Identifier of the fleet to display.")
      .action(async (fleetId: string) => {
        await this.onDisplayFleet(fleetId);
      });
  }

  private async onDisplayFleet(fleetId: string): Promise<void> {
    const fleet: FleetProjection = await this.controller.displayFleet(fleetId);
    console.log("Fleet : ", fleet);
  }

  private addRegisterVehicle(): void {
    this.command
      .command("register-vehicle")
      .description("Register a vehicle into a fleet.")
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
        "Plate number of the vehicle to localize."
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
    console.log("Vehicle localized.");
    console.log("Location:", location);
  }

  private addLocateVehicle(): void {
    this.command
      .command("locate-vehicle")
      .description("Locate a vehicle.")
      .argument("<fleetId>", "Identifier of the fleet.")
      .argument(
        "<vehiclePlateNumber>",
        "Plate number of the vehicle to locate."
      )
      .action(async (fleetId: string, vehiclePlateNumber: string) => {
        await this.onLocateVehicle(fleetId, vehiclePlateNumber);
      });
  }

  private async onLocateVehicle(
    fleetId: string,
    vehiclePlateNumber: string
  ): Promise<void> {
    const location: LocationProjection = await this.controller.locateVehicle(
      fleetId,
      vehiclePlateNumber
    );
    console.log("Vehicle located at:", location);
  }

  private async parseWithErrorHandling(): Promise<void> {
    try {
      await this.doParse();
    } catch (error: any) {
      this.handleError(error);
    }
  }

  private async doParse() {
    await this.command.parseAsync();
  }

  private handleError(error: any) {
    if (error instanceof Error) {
      console.log("Error occurred: ", (error as Error).message);
    } else {
      console.log("Unexpected error occurred: ", error);
    }
  }
}
