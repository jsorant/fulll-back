import { RootAggregate } from "../DddModel/RootAggregate";
import { Vehicle } from "./Entities/Vehicle";
import { FleetSnapshot } from "./FleetSnapshot";

export class Fleet implements RootAggregate {
  private readonly id: string;
  private readonly vehicles: Array<Vehicle>;

  private constructor(id: string, vehicles: Array<Vehicle>) {
    this.id = Object.freeze(id);
    this.vehicles = vehicles;
  }

  static makeNewFleet(id: string) {
    return new Fleet(id, []);
  }

  static makeFromSnapshot(snapshot: FleetSnapshot) {
    return new Fleet(snapshot.id, this.makeVehicleArrayFromSnapshot(snapshot));
  }

  private static makeVehicleArrayFromSnapshot(
    snapshot: FleetSnapshot
  ): Array<Vehicle> {
    return snapshot.vehicles.map((element) => new Vehicle(element.plate));
  }

  register(vehicle: Vehicle): void {
    this.ensureVehiculeIsNotAlreadyRegistered(vehicle);
    this.addVehicule(vehicle);
  }

  getId(): string {
    return this.id;
  }

  makeSnapshot(): FleetSnapshot {
    return new FleetSnapshot(
      this.id,
      this.vehicles.map((element) => element.makeSnapshot())
    );
  }

  private ensureVehiculeIsNotAlreadyRegistered(vehicle: Vehicle): void {
    if (this.contains(vehicle)) {
      throw new Error(
        `Vehicule '${vehicle.getPlate()}' has already been registered into fleet '${
          this.id
        }'.`
      );
    }
  }

  private contains(vehicle: Vehicle): boolean {
    return (
      this.vehicles.find(
        (element) => element.getPlate() === vehicle.getPlate()
      ) !== undefined
    );
  }

  private addVehicule(vehicle: Vehicle): void {
    this.vehicles.push(vehicle);
  }
}
