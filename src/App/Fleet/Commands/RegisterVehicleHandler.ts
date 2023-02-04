import { Fleet } from "../../../Domain/Fleet/Fleet";
import { RegisterVehicle } from "../../../Domain/Services/RegisterVehicle";
import { Vehicle } from "../../../Domain/Vehicle/Vehicle";
import { CommandHandler } from "../../CqrsModel/CommandHandler";
import { FleetsRepository } from "./Ports/FleetsRepository";
import { VehiclesRepository } from "./Ports/VehiclesRepository";
import { RegisterVehicle as RegisterVehicleCommand } from "./RegisterVehicle";

export class RegisterVehicleHandler
  implements CommandHandler<RegisterVehicleCommand>
{
  private vehiclesRepository: VehiclesRepository;
  private fleetsRepository: FleetsRepository;

  constructor(
    vehiclesRepository: VehiclesRepository,
    fleetsRepository: FleetsRepository
  ) {
    this.fleetsRepository = fleetsRepository;
    this.vehiclesRepository = vehiclesRepository;
  }

  async handle(command: RegisterVehicleCommand): Promise<void> {
    // TODO: add transactions/unit of work
    const vehicle: Vehicle = await this.getExistingVehicleOrMakeNewOne(
      command.plateNumber
    );
    const fleet: Fleet = await this.getFleet(command.fleetId);
    this.register(vehicle, fleet);
    await this.persistData(vehicle, fleet);
  }

  private async getExistingVehicleOrMakeNewOne(
    plateNumber: string
  ): Promise<Vehicle> {
    let vehicle: Vehicle | undefined =
      await this.vehiclesRepository.getFromPlateNumber(plateNumber);
    if (vehicle === undefined) {
      vehicle = Vehicle.createNew(plateNumber);
    }
    return vehicle;
  }

  private async getFleet(fleetId: string): Promise<Fleet> {
    return await this.fleetsRepository.get(fleetId);
  }

  private register(vehicle: Vehicle, fleet: Fleet): void {
    const service: RegisterVehicle = new RegisterVehicle();
    service.register(vehicle, fleet);
  }

  private async persistData(vehicle: Vehicle, fleet: Fleet): Promise<void> {
    await this.fleetsRepository.save(fleet);
    await this.vehiclesRepository.save(vehicle);
  }
}
