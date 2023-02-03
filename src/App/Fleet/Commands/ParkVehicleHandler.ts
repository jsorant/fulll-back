import { Vehicle } from "../../../Domain/Vehicle/Vehicle";
import { CommandHandler } from "../../CqrsModel/CommandHandler";
import { ParkVehicle } from "./ParkVehicle";
import { VehicleRepository } from "./Ports/VehicleRepository";

export class ParkVehicleHandler implements CommandHandler<ParkVehicle> {
  private vehicleRepository: VehicleRepository;

  constructor(vehicleRepository: VehicleRepository) {
    this.vehicleRepository = vehicleRepository;
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
    await this.vehicleRepository.save(vehicle);
  }

  private async getVehicleOrThrow(plateNumber: string): Promise<Vehicle> {
    let vehicle: Vehicle | undefined =
      await this.vehicleRepository.getFromPlateNumber(plateNumber);
    if (vehicle === undefined) {
      throw new Error(`No vehicle found with plate number ${plateNumber}`);
    }
    return vehicle;
  }
}
