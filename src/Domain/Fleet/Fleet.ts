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
    this.vehicles.push(vehicle);
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
}
