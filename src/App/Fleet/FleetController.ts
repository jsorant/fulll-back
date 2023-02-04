import { CreateFleet } from "./Commands/CreateFleet";
import { CreateFleetHandler } from "./Commands/CreateFleetHandler";
import { ParkVehicle } from "./Commands/ParkVehicle";
import { ParkVehicleHandler } from "./Commands/ParkVehicleHandler";
import { FleetsRepository } from "./Commands/Ports/FleetsRepository";
import { VehiclesRepository } from "./Commands/Ports/VehiclesRepository";
import { RegisterVehicle } from "./Commands/RegisterVehicle";
import { RegisterVehicleHandler } from "./Commands/RegisterVehicleHandler";
import { GetFleet } from "./Queries/GetFleet";
import { GetFleetHandler } from "./Queries/GetFleetHandler";
import { LocateVehicle } from "./Queries/LocateVehicle";
import { LocateVehicleHandler } from "./Queries/LocateVehicleHandler";
import { FleetProjections } from "./Queries/Ports/FleetProjections";
import { LocationProjections } from "./Queries/Ports/LocationProjections";
import { FleetProjection } from "./Queries/Views/FleetProjection";
import { LocationProjection } from "./Queries/Views/LocationProjection";

export class FleetController {
  private fleetsRepository: FleetsRepository;
  private vehicleRepository: VehiclesRepository;
  private fleetProjections: FleetProjections;
  private locationProjections: LocationProjections;

  constructor(
    fleetsRepository: FleetsRepository,
    vehicleRepository: VehiclesRepository,
    fleetProjections: FleetProjections,
    locationProjections: LocationProjections
  ) {
    this.fleetsRepository = fleetsRepository;
    this.vehicleRepository = vehicleRepository;
    this.fleetProjections = fleetProjections;
    this.locationProjections = locationProjections;
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
      this.vehicleRepository,
      this.fleetsRepository
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
      this.vehicleRepository
    );
    await handler.handle(command);
  }

  async locateVehicle(
    fleetId: string,
    vehiclePlateNumber: string
  ): Promise<LocationProjection> {
    const query: LocateVehicle = new LocateVehicle(fleetId, vehiclePlateNumber);
    const handler: LocateVehicleHandler = new LocateVehicleHandler(
      this.locationProjections
    );
    return await handler.handle(query);
  }

  private async createFleetOfUser(userId: string): Promise<void> {
    const command: CreateFleet = new CreateFleet(userId);
    const handler: CreateFleetHandler = new CreateFleetHandler(
      this.fleetsRepository
    );
    await handler.handle(command);
  }

  private async getFleetOfUser(userId: string): Promise<FleetProjection> {
    const query: GetFleet = GetFleet.makeWithUserId(userId);
    const handler: GetFleetHandler = new GetFleetHandler(this.fleetProjections);
    const fleet: FleetProjection = await handler.handle(query);
    return fleet;
  }
}
