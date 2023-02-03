import { Vehicle } from "../../../Domain/Vehicle/Vehicle";
import { CommandHandler } from "../../CqrsModel/CommandHandler";
import { ParkVehicle } from "./ParkVehicle";
import { VehiclesRepository } from "./Ports/VehiclesRepository";

export class ParkVehicleHandler implements CommandHandler<ParkVehicle> {
  private vehiclesRepository: VehiclesRepository;

  constructor(vehiclesRepository: VehiclesRepository) {
    this.vehiclesRepository = vehiclesRepository;
  }

  async handle(command: ParkVehicle): Promise<void> {
    const vehicle: Vehicle = await this.getVehicleOrThrow(
      command.vehiclePlateNumber
    );
    vehicle.park(
      command.locationLatitudeDegrees,
      command.locationLongitudeDegrees,
      command.locationAltitudeMeters
    );
    await this.vehiclesRepository.save(vehicle);
  }

  private async getVehicleOrThrow(plateNumber: string): Promise<Vehicle> {
    let vehicle: Vehicle | undefined =
      await this.vehiclesRepository.getFromPlateNumber(plateNumber);
    if (vehicle === undefined) {
      throw new Error(`No vehicle found with plate number ${plateNumber}`);
    }
    return vehicle;
  }
}
