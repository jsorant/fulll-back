import { SharedMemory } from "./SharedMemory";
import { VehiclesRepository } from "../../../../App/Fleet/Commands/Ports/VehiclesRepository";
import { Vehicle } from "../../../../Domain/Vehicle/Vehicle";

export class InMemoryVehiclesRepository implements VehiclesRepository {
  private sharedMemory: SharedMemory;

  constructor(sharedMemory: SharedMemory) {
    this.sharedMemory = sharedMemory;
  }

  async getFromPlateNumber(plateNumber: string): Promise<Vehicle | undefined> {
    return await this.sharedMemory.findVehicleFromPlateNumber(plateNumber);
  }

  async get(id: string): Promise<Vehicle> {
    return await this.sharedMemory.findVehicleOrThrow(id);
  }

  async save(vehicle: Vehicle): Promise<void> {
    await this.sharedMemory.removeVehicle(vehicle.id.value);
    await this.sharedMemory.addVehicle(vehicle);
  }
}
