import { CreateFleet } from "../../App/Fleet/Commands/CreateFleet";
import { CreateFleetHandler } from "../../App/Fleet/Commands/CreateFleetHandler";
import { ParkVehicle } from "../../App/Fleet/Commands/ParkVehicle";
import { ParkVehicleHandler } from "../../App/Fleet/Commands/ParkVehicleHandler";
import { FleetRepository } from "../../App/Fleet/Commands/Ports/FleetRepository";
import { RegisterVehicle } from "../../App/Fleet/Commands/RegisterVehicle";
import { RegisterVehicleHandler } from "../../App/Fleet/Commands/RegisterVehicleHandler";
import { GetFleet } from "../../App/Fleet/Queries/GetFleet";
import { GetFleetHandler } from "../../App/Fleet/Queries/GetFleetHandler";
import { LocateVehicle } from "../../App/Fleet/Queries/LocateVehicle";
import { LocateVehicleHandler } from "../../App/Fleet/Queries/LocateVehicleHandler";
import { FleetProjections } from "../../App/Fleet/Queries/Ports/FleetProjections";
import { FleetProjection } from "../../App/Fleet/Queries/Views/FleetProjection";
import { LocationProjection } from "../../App/Fleet/Queries/Views/LocationProjection";

export class FleetCommandLineController {
  private fleetRepository: FleetRepository;
  private fleetProjections: FleetProjections;

  constructor(
    fleetRepository: FleetRepository,
    fleetProjections: FleetProjections
  ) {
    this.fleetRepository = fleetRepository;
    this.fleetProjections = fleetProjections;
  }

  async createFleet(userId: string): Promise<string> {
    await this.createFleetOfUser(userId);
    const fleet: FleetProjection = await this.getFleetOfUser(userId);
    return fleet.id;
  }

  async registerVehicle(
    fleetId: string,
    vehiclePlateNumber: string
  ): Promise<void> {
    const command: RegisterVehicle = new RegisterVehicle(
      vehiclePlateNumber,
      fleetId
    );
    const handler: RegisterVehicleHandler = new RegisterVehicleHandler(
      this.fleetRepository
    );
    await handler.handle(command);
  }

  async parkVehicle(
    fleetId: string,
    vehiclePlateNumber: string,
    locationLatitudeDegrees: string,
    locationLongitudeDegrees: string,
    locationAltitudeMeters?: string
  ): Promise<void> {
    const command: ParkVehicle = new ParkVehicle(
      fleetId,
      vehiclePlateNumber,
      Number.parseInt(locationLatitudeDegrees),
      Number.parseInt(locationLongitudeDegrees),
      locationAltitudeMeters
        ? Number.parseInt(locationAltitudeMeters)
        : undefined
    );
    const handler: ParkVehicleHandler = new ParkVehicleHandler(
      this.fleetRepository
    );
    await handler.handle(command);
  }

  async locateVehicle(
    fleetId: string,
    vehiclePlateNumber: string
  ): Promise<LocationProjection> {
    const query: LocateVehicle = new LocateVehicle(fleetId, vehiclePlateNumber);
    const handler: LocateVehicleHandler = new LocateVehicleHandler(
      this.fleetProjections
    );
    return await handler.handle(query);
  }

  private async createFleetOfUser(userId: string): Promise<void> {
    const command: CreateFleet = new CreateFleet(userId);
    const handler: CreateFleetHandler = new CreateFleetHandler(
      this.fleetRepository
    );
    await handler.handle(command);
  }

  private async getFleetOfUser(userId: string): Promise<FleetProjection> {
    const query: GetFleet = new GetFleet(userId);
    const handler: GetFleetHandler = new GetFleetHandler(this.fleetProjections);
    const fleet: FleetProjection = await handler.handle(query);
    return fleet;
  }
}
