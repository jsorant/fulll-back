import { RootAggregate } from "../DddModel/RootAggregate";
import { Vehicle } from "./Entities/Vehicle";
import { Location } from "./ValueObjects/Location";
import { PlateNumber } from "./ValueObjects/PlateNumber";
import { Identifier } from "../SharedKernel/Indentifier";

export class Fleet extends RootAggregate {
  private readonly userId: Identifier;
  private readonly vehicles: Array<Vehicle>;

  private constructor(userId: Identifier, vehicles: Array<Vehicle>) {
    super();
    this.userId = userId;
    this.vehicles = vehicles;
  }

  static createNewFleet(userId: Identifier) {
    return new Fleet(userId, []);
  }

  getUserId(): Identifier {
    return this.userId;
  }

  getVehicles(): Array<Vehicle> {
    return this.vehicles;
  }

  register(vehiclePlateNumber: string): void {
    this.ensureVehicleIsNotAlreadyRegistered(vehiclePlateNumber);
    this.registerNewVehicle(vehiclePlateNumber);
  }

  parkVehicle(
    vehiclePlateNumber: string,
    latitudeDegrees: number,
    longitudeDegrees: number,
    altitudeMeters?: number
  ): void {
    const location: Location = new Location(
      latitudeDegrees,
      longitudeDegrees,
      altitudeMeters
    );
    const vehicle: Vehicle = this.findVehicleOrThrow(vehiclePlateNumber);
    vehicle.park(location);
  }

  private ensureVehicleIsNotAlreadyRegistered(plateNumber: string): void {
    if (this.isRegistered(plateNumber)) {
      throw new Error(
        `Vehicle with plate number '${plateNumber}' has already been registered into fleet '${this.getId()}'.`
      );
    }
  }

  private isRegistered(plateNumber: string): boolean {
    return this.findVehicle(plateNumber) !== undefined;
  }

  private findVehicleOrThrow(plateNumber: string): Vehicle {
    const vehicle: Vehicle | undefined = this.findVehicle(plateNumber);
    if (vehicle === undefined) {
      throw new Error(
        `Vehicle with plate number '${plateNumber}' is not registered into fleet '${this.getId()}'.`
      );
    }
    return vehicle;
  }

  private findVehicle(vehiclePlateNumber: string): Vehicle | undefined {
    const vehiclePlateNumberToSeek: PlateNumber = new PlateNumber(
      vehiclePlateNumber
    );
    return this.vehicles.find((vehicle) =>
      vehicle.getPlateNumber().equals(vehiclePlateNumberToSeek)
    );
  }

  private registerNewVehicle(vehiclePlateNumber: string): void {
    const vehicle: Vehicle = new Vehicle(vehiclePlateNumber);
    this.vehicles.push(vehicle);
  }
}
