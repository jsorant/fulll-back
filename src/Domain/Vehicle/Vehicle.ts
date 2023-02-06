import { RootAggregate } from "../DddModel/RootAggregate";
import { PlateNumber } from "./ValueObjects/PlateNumber";
import { Location } from "./ValueObjects/Location";
import { VehicleId } from "./ValueObjects/VehicleId";

export class Vehicle extends RootAggregate<VehicleId> {
  public readonly plateNumber: PlateNumber;
  public location: Location | undefined;

  private constructor(
    id: VehicleId,
    plateNumber: PlateNumber,
    location?: Location
  ) {
    super(id);
    this.plateNumber = plateNumber;
    this.location = location;
  }

  static createNew(plateNumber: string): Vehicle {
    return new Vehicle(VehicleId.createNew(), new PlateNumber(plateNumber));
  }

  static createFrom(
    id: string,
    plateNumber: string,
    locationLatitudeDegrees?: number,
    locationLongitudeDegrees?: number,
    locationAltitudeMeters?: number
  ): Vehicle {
    return new Vehicle(
      VehicleId.createFrom(id),
      new PlateNumber(plateNumber),
      this.createLocationIfAvailable(
        locationLatitudeDegrees,
        locationLongitudeDegrees,
        locationAltitudeMeters
      )
    );
  }

  private static createLocationIfAvailable(
    locationLatitudeDegrees?: number,
    locationLongitudeDegrees?: number,
    locationAltitudeMeters?: number
  ): Location | undefined {
    if (locationLatitudeDegrees && locationLongitudeDegrees) {
      return new Location(
        locationLatitudeDegrees,
        locationLongitudeDegrees,
        locationAltitudeMeters
      );
    } else {
      return undefined;
    }
  }

  park(
    locationLatitudeDegrees: number,
    locationLongitudeDegrees: number,
    locationAltitudeMeters?: number
  ): void {
    const location: Location = new Location(
      locationLatitudeDegrees,
      locationLongitudeDegrees,
      locationAltitudeMeters
    );
    this.ensureVehicleIsNotAlreadyParkedAt(location);
    this.location = location;
  }

  private ensureVehicleIsNotAlreadyParkedAt(location: Location): void {
    if (this.location && this.location.equals(location)) {
      throw new Error(`Vehicle is already parked at this location.`);
    }
  }
}
