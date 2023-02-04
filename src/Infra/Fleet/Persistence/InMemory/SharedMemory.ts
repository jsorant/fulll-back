import { Fleet } from "../../../../Domain/Fleet/Fleet";
import { Vehicle } from "../../../../Domain/Vehicle/Vehicle";
import { Location } from "../../../../Domain/Vehicle/ValueObjects/Location";

export class SharedMemory {
  private fleets: Array<Fleet> = [];
  private vehicles: Array<Vehicle> = [];

  // Helpers:

  findFleetFromUserIdOrThrow(userId: string): Fleet {
    const fleet: Fleet | undefined = this.findFleetFromUserId(userId);

    if (fleet === undefined) {
      throw new Error("Fleet not found for user id: " + userId);
    }

    return fleet;
  }

  findFleetFromUserId(userId: string): Fleet | undefined {
    return this.fleets.find((fleet) => fleet.userId.value === userId);
  }

  findFleetOrThrow(id: string): Fleet {
    const fleet: Fleet | undefined = this.findFleet(id);

    if (fleet === undefined) {
      throw new Error("Fleet not found for id: " + id);
    }

    return fleet;
  }

  findFleet(id: string): Fleet | undefined {
    return this.fleets.find((fleet) => fleet.id.value === id);
  }

  removeFleet(id: string): void {
    this.fleets = this.fleets.filter((fleet: Fleet) => fleet.id.value !== id);
  }

  addFleet(fleet: Fleet) {
    this.fleets.push(fleet);
  }

  findVehicleFromPlateNumberOrThrow(plateNumber: string): Vehicle {
    const vehicle: Vehicle | undefined =
      this.findVehicleFromPlateNumber(plateNumber);

    if (vehicle === undefined) {
      throw new Error("Vehicle not found for plate number: " + plateNumber);
    }

    return vehicle;
  }

  findVehicleOrThrow(id: string): Vehicle {
    const vehicle: Vehicle | undefined = this.findVehicle(id);

    if (vehicle === undefined) {
      throw new Error("Vehicle not found for id: " + id);
    }

    return vehicle;
  }

  findVehicle(id: string): Vehicle | undefined {
    return this.vehicles.find((vehicle) => vehicle.id.value === id);
  }

  findVehicleFromPlateNumber(plateNumber: string): Vehicle | undefined {
    return this.vehicles.find(
      (vehicle) => vehicle.plateNumber.value === plateNumber
    );
  }

  removeVehicle(id: string) {
    this.vehicles = this.vehicles.filter(
      (vehicle: Vehicle) => vehicle.id.value !== id
    );
  }

  addVehicle(vehicle: Vehicle) {
    this.vehicles.push(vehicle);
  }

  findLocationOrThrow(plateNumber: string): Location {
    const vehicle: Vehicle =
      this.findVehicleFromPlateNumberOrThrow(plateNumber);
    return this.findLocationFromVehicleOrThrow(vehicle);
  }

  findLocationFromVehicleOrThrow(vehicle: Vehicle): Location {
    const location: Location | undefined = vehicle.location;

    if (location === undefined) {
      throw new Error(
        "No location found for given vehicle. Plate number: " +
          vehicle.plateNumber.value
      );
    }

    return location;
  }
}
