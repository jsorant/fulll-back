import { RootAggregate } from "../DddModel/RootAggregate";
import { FleetSnapshot } from "./FleetSnapshot";
import { FleetId } from "./ValueObjects/FleetId";
import { Vehicle } from "./Entities/Vehicle";
import { Location } from "./ValueObjects/Location";
import { PlateNumber } from "./ValueObjects/PlateNumber";

export class Fleet extends RootAggregate<FleetId> {
  private readonly registeredVehicles: Array<Vehicle>;

  private constructor(id: FleetId, registeredVehicles: Array<Vehicle>) {
    super(id);
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
    this.ensureVehicleIsNotAlreadyRegistered(vehiclePlateNumber);
    this.registerNewVehicule(vehiclePlateNumber);
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
    const vehicle: Vehicle | undefined = this.findVehicle(vehiclePlateNumber);
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
    return snapshot.registeredVehicles.map(
      (vehicle) => new Vehicle(vehicle.plateNumber, vehicle.location)
    );
  }

  private ensureVehicleIsNotAlreadyRegistered(plateNumber: string): void {
    if (this.isRegistered(plateNumber)) {
      throw new Error(
        `Vehicle with plate number '${plateNumber}' has already been registered into fleet '${this.id.value}'.`
      );
    }
  }

  private isRegistered(plateNumber: string): boolean {
    return this.findVehicle(plateNumber) !== undefined;
  }

  private findVehicle(plateNumber: string): Vehicle | undefined {
    //TODO better way to do this ?
    const plateNumberToCompate: PlateNumber = new PlateNumber(plateNumber);
    return this.registeredVehicles.find((registeredVehicle) =>
      registeredVehicle.id.equals(plateNumberToCompate)
    );
  }

  private registerNewVehicule(vehiclePlateNumber: string): void {
    const vehicle: Vehicle = new Vehicle(vehiclePlateNumber);
    this.registeredVehicles.push(vehicle);
  }
}
