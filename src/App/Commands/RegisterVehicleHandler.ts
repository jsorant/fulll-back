import { Fleet } from "../../Domain/Fleet/Fleet";
import { Vehicle } from "../../Domain/Vehicle/Vehicle";
import { CommandHandler } from "../CqrsModel/CommandHandler";
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
    fleet.registerVehicle(vehicle.id.value);
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

  private async persistData(vehicle: Vehicle, fleet: Fleet): Promise<void> {
    await this.fleetsRepository.save(fleet);
    await this.vehiclesRepository.save(vehicle);
  }
}
