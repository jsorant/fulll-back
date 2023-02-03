import { Vehicle } from "../../../Domain/Vehicle/Vehicle";
import { CommandHandler } from "../../CqrsModel/CommandHandler";
import { VehicleRepository } from "./Ports/VehicleRepository";
import { RegisterVehicle } from "./RegisterVehicle";

export class RegisterVehicleHandler implements CommandHandler<RegisterVehicle> {
  private vehicleRepository: VehicleRepository;

  constructor(vehicleRepository: VehicleRepository) {
    this.vehicleRepository = vehicleRepository;
  }

  async handle(command: RegisterVehicle): Promise<void> {
    const vehicle: Vehicle = await this.getExistingVehicleOrMakeNewOne(
      command.plateNumber
    );
    vehicle.registerToFleet(command.fleetId);
    this.vehicleRepository.save(vehicle);

    //TODO update fleet as well

    //TODO implement unit of work and cancellation
  }

  private async getExistingVehicleOrMakeNewOne(
    plateNumber: string
  ): Promise<Vehicle> {
    let vehicle: Vehicle | undefined =
      await this.vehicleRepository.getFromPlateNumber(plateNumber);
    if (vehicle === undefined) {
      vehicle = Vehicle.createNew(plateNumber);
    }
    return vehicle;
  }
}
