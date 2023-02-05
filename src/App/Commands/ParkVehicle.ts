import { Command } from "../CqrsModel/Command";

export class ParkVehicle implements Command {
  readonly fleetId: string;
  readonly vehiclePlateNumber: string;
  readonly locationLatitudeDegrees: number;
  readonly locationLongitudeDegrees: number;
  readonly locationAltitudeMeters?: number;

  constructor(
    fleetId: string,
    vehiclePlateNumber: string,
    locationLatitudeDegrees: number,
    locationLongitudeDegrees: number,
    locationAltitudeMeters?: number
  ) {
    this.fleetId = fleetId;
    this.vehiclePlateNumber = vehiclePlateNumber;
    this.locationLatitudeDegrees = locationLatitudeDegrees;
    this.locationLongitudeDegrees = locationLongitudeDegrees;
    this.locationAltitudeMeters = locationAltitudeMeters;
  }
}
