import { RootAggregate } from "../DddModel/RootAggregate";
import { PlateNumber } from "./ValueObjects/PlateNumber";
import { Location } from "./ValueObjects/Location";
import { VehicleId } from "./ValueObjects/VehicleId";
import { FleetId } from "./ValueObjects/FleetId";

export class Vehicle extends RootAggregate<VehicleId> {
  public readonly plateNumber: PlateNumber;
  public readonly fleets: Array<FleetId>;
  public location: Location | undefined;

  private constructor(
    id: VehicleId,
    plateNumber: PlateNumber,
    fleets: Array<FleetId>,
    location?: Location
  ) {
    super(id);
    this.plateNumber = plateNumber;
    this.fleets = fleets;
    this.location = location;
  }

  static createNew(plateNumber: string) {
    return new Vehicle(VehicleId.createNew(), new PlateNumber(plateNumber), []);
  }

  static createFrom(
    id: string,
    plateNumber: string,
    fleets: Array<string>,
    locationLatitudeDegrees?: number,
    locationLongitudeDegrees?: number,
    locationAltitudeMeters?: number
  ) {
    new Vehicle(
      VehicleId.createFrom(id),
      new PlateNumber(plateNumber),
      fleets.map(FleetId.createFrom),
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

  registerToFleet(id: string): void {
    const fleetId: FleetId = FleetId.createFrom(id);
    this.ensureFleetIsNotAlreadyRegistered(fleetId);
    this.addFleet(fleetId);
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
    this.doPark(location);
  }

  private ensureFleetIsNotAlreadyRegistered(fleetId: FleetId): void {
    if (this.hasFleet(fleetId)) {
      throw new Error(`Vehicle has already been registered.`);
    }
  }

  private hasFleet(fleetId: FleetId): boolean {
    return (
      this.fleets.find((currentFleetId) => currentFleetId.equals(fleetId)) !==
      undefined
    );
  }

  private addFleet(fleetId: FleetId): void {
    this.fleets.push(fleetId.clone());
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
