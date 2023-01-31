import { RootAggregate } from "../DddModel/RootAggregate";
import { FleetSnapshot } from "./FleetSnapshot";
import { FleetId } from "./ValueObjects/FleetId";
import { Vehicle } from "./ValueObjects/Vehicle";
import { Location } from "./ValueObjects/Location";

export class Fleet implements RootAggregate {
  private readonly id: FleetId;
  private readonly registeredVehicles: Array<Vehicle>;

  private constructor(id: FleetId, registeredVehicles: Array<Vehicle>) {
    this.id = Object.freeze(id);
    this.registeredVehicles = registeredVehicles;
  }

  static makeNewFleet(id: string) {
    return new Fleet(new FleetId(id), []);
  }

  static makeFromSnapshot(snapshot: FleetSnapshot) {
    return new Fleet(
      new FleetId(snapshot.id),
      this.makeRegisteredVehiclesFromSnapshot(snapshot)
    );
  }

  register(vehiclePlateNumber: string): void {
    const vehicle: Vehicle = Vehicle.make(vehiclePlateNumber);
    this.ensureVehicleIsNotAlreadyRegistered(vehicle);
    this.doRegister(vehicle);
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
    //TODO remove
    const vehicleToFind: Vehicle = Vehicle.make(vehiclePlateNumber);
    const vehicle: Vehicle | undefined = this.findVehicle(vehicleToFind);
    if (vehicle === undefined) {
      throw new Error(
        `Vehicle with plate number '${vehiclePlateNumber}' is not registered into fleet '${this.id.value}'.`
      );
    }
    vehicle.park(location);
  }

  makeSnapshot(): FleetSnapshot {
    return new FleetSnapshot(
      this.id.value,
      this.registeredVehicles.map((vehicle) => vehicle.makeSnapshot())
    );
  }

  private static makeRegisteredVehiclesFromSnapshot(
    snapshot: FleetSnapshot
  ): Array<Vehicle> {
    return snapshot.registeredVehicles.map((vehicle) =>
      Vehicle.make(vehicle.plateNumber)
    );
  }

  private ensureVehicleIsNotAlreadyRegistered(vehicle: Vehicle): void {
    if (this.isRegistered(vehicle)) {
      throw new Error(
        `Vehicle with plate number '${vehicle.getDisplayablePlateNumber()}' has already been registered into fleet '${
          this.id.value
        }'.`
      );
    }
  }

  private isRegistered(vehicle: Vehicle): boolean {
    return this.findVehicle(vehicle) !== undefined;
  }

  private findVehicle(vehicle: Vehicle): Vehicle | undefined {
    // TODO search by key => vehicle is an entity
    return this.registeredVehicles.find((registeredVehicle) =>
      registeredVehicle.equals(vehicle)
    );
  }

  private doRegister(vehicle: Vehicle): void {
    this.registeredVehicles.push(vehicle);
  }
}
