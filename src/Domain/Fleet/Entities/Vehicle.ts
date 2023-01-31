import { PlateNumber as PlateNumber } from "../ValueObjects/PlateNumber";
import { VehicleSnapshot } from "./VehicleSnapshot";
import { Location } from "../ValueObjects/Location";
import { Entity } from "../../DddModel/entity";

export class Vehicle extends Entity<PlateNumber> {
  private currentLocation: Location | undefined;

  constructor(plateNumber: string, currentLocation?: Location) {
    super(new PlateNumber(plateNumber));
    this.currentLocation = currentLocation;
  }

  getDisplayablePlateNumber(): string {
    return this.id.value;
  }

  park(location: Location): void {
    this.ensureVehicleIsNotAlreadyParkedAt(location);
    this.doPark(location);
  }

  makeSnapshot(): VehicleSnapshot {
    return new VehicleSnapshot(this.id.value, this.currentLocation);
  }

  private ensureVehicleIsNotAlreadyParkedAt(location: Location): void {
    if (this.currentLocation && this.currentLocation.equals(location)) {
      throw new Error(`Vehicle is already parked at this location.`);
    }
  }

  private doPark(location: Location): void {
    this.currentLocation = location;
  }
}
