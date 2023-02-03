import { FleetsRepository } from "../../../App/Fleet/Commands/Ports/FleetRepository";
import { FleetProjections } from "../../../App/Fleet/Queries/Ports/FleetProjections";
import { LocationProjection } from "../../../App/Fleet/Queries/Views/LocationProjection";
import { Fleet } from "../../../Domain/Fleet/Fleet";
import { FleetProjection } from "../../../App/Fleet/Queries/Views/FleetProjection";
import { Vehicle } from "../../../Domain/Vehicle/Vehicle";
import { Location } from "../../../Domain/Vehicle/ValueObjects/Location";
import { VehiclesRepository } from "../../../App/Fleet/Commands/Ports/VehicleRepository";
import { VehicleId } from "../../../Domain/Fleet/ValueObjects/VehicleId";

class SharedMemory {
  public static fleets: Array<Fleet> = [];
  public static vehicles: Array<Vehicle> = [];

  findFleetFromUserIdOrThrow(userId: string): Fleet {
    const foundFleet: Fleet | undefined = this.findFleetFromUserId(userId);

    if (foundFleet === undefined) {
      throw new Error("Fleet not found for user id: " + userId);
    }

    return foundFleet;
  }

  findFleetFromUserId(userId: string): Fleet | undefined {
    return SharedMemory.fleets.find((fleet) => fleet.userId.value === userId);
  }

  findFleetOrThrow(id: string): Fleet {
    const foundFleet: Fleet | undefined = this.findFleet(id);

    if (foundFleet === undefined) {
      throw new Error("Fleet not found for id: " + id);
    }

    return foundFleet;
  }

  findFleet(id: string): Fleet | undefined {
    return SharedMemory.fleets.find((fleet) => fleet.id.value === id);
  }

  removeFleet(id: string): void {
    SharedMemory.fleets = SharedMemory.fleets.filter(
      (fleet: Fleet) => fleet.id.value !== id
    );
  }

  addFleet(fleet: Fleet) {
    SharedMemory.fleets.push(fleet);
  }

  findVehicleFromPlateNumberOrThrow(plateNumber: string): Vehicle {
    const foundVehicle: Vehicle | undefined =
      this.findVehicleFromPlateNumber(plateNumber);

    if (foundVehicle === undefined) {
      throw new Error("Vehicle not found for plate number: " + plateNumber);
    }

    return foundVehicle;
  }

  findVehicleOrThrow(id: string): Vehicle {
    const foundVehicle: Vehicle | undefined = this.findVehicle(id);

    if (foundVehicle === undefined) {
      throw new Error("Vehicle not found for id: " + id);
    }

    return foundVehicle;
  }

  findVehicle(id: string): Vehicle | undefined {
    return SharedMemory.vehicles.find((vehicle) => vehicle.id.value === id);
  }

  findVehicleFromPlateNumber(plateNumber: string): Vehicle | undefined {
    return SharedMemory.vehicles.find(
      (vehicle) => vehicle.plateNumber.value === plateNumber
    );
  }

  removeVehicle(id: string) {
    SharedMemory.vehicles = SharedMemory.vehicles.filter(
      (vehicle: Vehicle) => vehicle.id.value !== id
    );
  }

  addVehicle(vehicle: Vehicle) {
    SharedMemory.vehicles.push(vehicle);
  }

  //

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

export class InMemoryFleetsRepository implements FleetsRepository {
  private sharedMemory: SharedMemory;

  constructor(sharedMemory: SharedMemory) {
    this.sharedMemory = sharedMemory;
  }

  async hasForUserId(userId: string): Promise<boolean> {
    return this.sharedMemory.findFleetFromUserId(userId) !== undefined;
  }

  async get(id: string): Promise<Fleet> {
    return this.sharedMemory.findFleetOrThrow(id);
  }

  async save(fleet: Fleet): Promise<void> {
    this.sharedMemory.removeFleet(fleet.id.value);
    this.sharedMemory.addFleet(fleet);
  }
}

export class InMemoryVehiclesRepository implements VehiclesRepository {
  private sharedMemory: SharedMemory;

  constructor(sharedMemory: SharedMemory) {
    this.sharedMemory = sharedMemory;
  }

  async getFromPlateNumber(plateNumber: string): Promise<Vehicle> {
    return this.sharedMemory.findVehicleFromPlateNumberOrThrow(plateNumber);
  }

  async get(id: string): Promise<Vehicle> {
    return this.sharedMemory.findVehicleOrThrow(id);
  }

  async save(vehicle: Vehicle): Promise<void> {
    this.sharedMemory.removeVehicle(vehicle.id.value);
    this.sharedMemory.addVehicle(vehicle);
  }
}

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

  async getVehicleLocation(
    fleetId: string,
    plateNumber: string
  ): Promise<LocationProjection> {
    const location: Location =
      this.sharedMemory.findLocationOrThrow(plateNumber);
    return this.adaptToLocationProjection(location);
  }

  private adaptToFleetProjection(fleet: Fleet): FleetProjection {
    return {
      id: fleet.id.value,
      userId: fleet.userId.value,
      vehiclesPlateNumber: fleet.vehicles.map(this.getVehiclePlateNumber),
    };
  }

  private getVehiclePlateNumber(vehicleId: VehicleId): string {
    const vehicle: Vehicle = this.sharedMemory.findVehicleOrThrow(
      vehicleId.value
    );
    return vehicle.plateNumber.value;
  }

  adaptToLocationProjection(location: Location): LocationProjection {
    return {
      latitudeDegrees: location.latitudeDegrees,
      longitudeDegrees: location.longitudeDegrees,
      altitudeMeters: location.altitudeMeters,
    };
  }
}
