import { SharedMemory } from "./SharedMemory";
import { FleetProjections } from "../../../App/Fleet/Queries/Ports/FleetProjections";
import { FleetProjection } from "../../../App/Fleet/Queries/Views/FleetProjection";
import { Fleet } from "../../../Domain/Fleet/Fleet";
import { Vehicle } from "../../../Domain/Vehicle/Vehicle";
import { VehicleId } from "../../../Domain/Fleet/ValueObjects/VehicleId";

export class InMemoryFleetProjections implements FleetProjections {
  private sharedMemory: SharedMemory;

  constructor(sharedMemory: SharedMemory) {
    this.sharedMemory = sharedMemory;
  }

  async getFleetForUser(userId: string): Promise<FleetProjection> {
    const fleet: Fleet = this.sharedMemory.findFleetFromUserIdOrThrow(userId);
    return this.adaptToFleetProjection(fleet);
  }

  async getFleet(fleetId: string): Promise<FleetProjection> {
    const foundFleet: Fleet = this.sharedMemory.findFleetOrThrow(fleetId);
    return this.adaptToFleetProjection(foundFleet);
  }

  private adaptToFleetProjection(fleet: Fleet): FleetProjection {
    return {
      id: fleet.id.value,
      userId: fleet.userId.value,
      vehiclesPlateNumber: fleet.vehicles.map((vehicleId) =>
        this.getVehiclePlateNumber(vehicleId)
      ),
    };
  }

  private getVehiclePlateNumber(vehicleId: VehicleId): string {
    const vehicle: Vehicle = this.sharedMemory.findVehicleOrThrow(
      vehicleId.value
    );
    return vehicle.plateNumber.value;
  }
}
