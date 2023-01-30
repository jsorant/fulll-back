import { Entity } from "../../DddModel/entity";
import { VehicleSnapshot } from "./VehicleSnapshot";

export class Vehicle implements Entity {
  private readonly plate: string;

  constructor(plate: string) {
    this.plate = Object.freeze(plate);
  }

  getPlate(): string {
    return this.plate;
  }

  makeSnapshot(): VehicleSnapshot {
    return new VehicleSnapshot(this.plate);
  }
}
