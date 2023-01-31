import { ValueObject } from "../../DddModel/ValueObject";
import { PlateNumber as PlateNumber } from "./PlateNumber";
import { VehicleSnapshot } from "./VehicleSnapshot";

export class Vehicle extends ValueObject {
  private readonly plateNumber: PlateNumber;

  private constructor(licensePlate: PlateNumber) {
    super();
    this.plateNumber = Object.freeze(licensePlate);
  }

  static make(licensePlate: string): Vehicle {
    return new Vehicle(new PlateNumber(licensePlate));
  }

  getDisplayablePlateNumber(): string {
    return this.plateNumber.value;
  }

  makeSnapshot(): VehicleSnapshot {
    return new VehicleSnapshot(this.plateNumber.value);
  }
}
