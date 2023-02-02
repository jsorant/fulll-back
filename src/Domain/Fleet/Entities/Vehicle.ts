import { PlateNumber as PlateNumber } from "../ValueObjects/PlateNumber";
import { Location } from "../ValueObjects/Location";
import { Entity } from "../../DddModel/Entity";
import { Identifier } from "../../SharedKernel/Identifier";

export class Vehicle extends Entity {
  private readonly plateNumber: PlateNumber;
  private location: Location | undefined;

  constructor(plateNumber: string, id?: Identifier, location?: Location) {
    super(id);
    this.plateNumber = new PlateNumber(plateNumber);
    this.location = location;
  }

  park(location: Location): void {
    this.ensureVehicleIsNotAlreadyParkedAt(location);
    this.doPark(location);
  }

  getPlateNumber(): PlateNumber {
    return this.plateNumber.clone();
  }

  getLocation(): Location | undefined {
    if (this.location === undefined) {
      return undefined;
    }
    return this.location.clone();
  }

  private ensureVehicleIsNotAlreadyParkedAt(location: Location): void {
    if (this.location && this.location.equals(location)) {
      throw new Error(`Vehicle is already parked at this location.`);
    }
  }

  private doPark(location: Location): void {
    this.location = location.clone();
  }
}
