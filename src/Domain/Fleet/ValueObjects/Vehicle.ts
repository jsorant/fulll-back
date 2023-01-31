import { ValueObject } from "../../DddModel/ValueObject";
import { PlateNumber as PlateNumber } from "./PlateNumber";
import { VehicleSnapshot } from "./VehicleSnapshot";
import { Location } from "./Location";

export class Vehicle extends ValueObject {
  private readonly plateNumber: PlateNumber;
  private currentLocation: Location | undefined;

  constructor(plateNumber: PlateNumber) {
    super();
    this.plateNumber = Object.freeze(plateNumber);
    this.currentLocation = undefined;
  }

  static make(plateNumber: string): Vehicle {
    return new Vehicle(new PlateNumber(plateNumber));
  }

  getDisplayablePlateNumber(): string {
    return this.plateNumber.value;
  }

  park(location: Location): void {
    this.currentLocation = location;
  }

  makeSnapshot(): VehicleSnapshot {
    return new VehicleSnapshot(this.plateNumber.value, this.currentLocation);
  }
}
