import { Location } from "../ValueObjects/Location";

export class VehicleSnapshot {
  public readonly plateNumber: string;
  public readonly location?: Location;

  constructor(plateNumber: string, location?: Location) {
    this.plateNumber = Object.freeze(plateNumber);
    this.location = Object.freeze(location);
  }
}
