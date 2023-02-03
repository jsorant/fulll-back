import { Vehicle } from "../../../../Domain/Vehicle/Vehicle";

export interface VehicleRepository {
  getFromPlateNumber(plateNumber: string): Promise<Vehicle | undefined>;
  get(id: string): Promise<Vehicle>;
  save(vehicle: Vehicle): Promise<void>;
}
