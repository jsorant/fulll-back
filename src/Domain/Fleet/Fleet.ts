import { RootAggregate } from "../DddModel/RootAggregate";
import { FleetSnapshot } from "./FleetSnapshot";
import { FleetId } from "./ValueObjects/FleetId";
import { Vehicle } from "./ValueObjects/Vehicle";

export class Fleet implements RootAggregate {
  private readonly id: FleetId;
  private readonly registeredVehicules: Array<Vehicle>;

  private constructor(id: FleetId, registeredVehicules: Array<Vehicle>) {
    this.id = Object.freeze(id);
    this.registeredVehicules = registeredVehicules;
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
    this.ensureVehiculeIsNotAlreadyRegistered(vehicle);
    this.doRegister(vehicle);
  }

  makeSnapshot(): FleetSnapshot {
    return new FleetSnapshot(
      this.id.value,
      this.registeredVehicules.map((vehicle) => vehicle.makeSnapshot())
    );
  }

  private static makeRegisteredVehiclesFromSnapshot(
    snapshot: FleetSnapshot
  ): Array<Vehicle> {
    return snapshot.registeredVehicules.map((vehicle) =>
      Vehicle.make(vehicle.licensePlate)
    );
  }

  private ensureVehiculeIsNotAlreadyRegistered(vehicle: Vehicle): void {
    if (this.isRegistered(vehicle)) {
      throw new Error(
        `Vehicule with plate number '${vehicle.getDisplayablePlateNumber()}' has already been registered into fleet '${
          this.id.value
        }'.`
      );
    }
  }

  private isRegistered(vehicle: Vehicle): boolean {
    return (
      this.registeredVehicules.find((registeredVehicule) =>
        registeredVehicule.equals(vehicle)
      ) !== undefined
    );
  }

  private doRegister(vehicle: Vehicle): void {
    this.registeredVehicules.push(vehicle);
  }
}
