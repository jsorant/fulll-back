import { Command } from "../../CqrsModel/Command";

export class ParkVehicle implements Command {
  public readonly fleetId: string;
  public readonly plateNumber: string;
  public readonly locationLatitudeDegrees: number;
  public readonly locationLongitudeDegrees: number;
  public readonly locationAltitudeMeters?: number;

  constructor(
    fleetId: string,
    plateNumber: string,
    locationLatitudeDegrees: number,
    locationLongitudeDegrees: number,
    locationAltitudeMeters: number
  ) {
    this.fleetId = fleetId;
    this.plateNumber = plateNumber;
    this.locationLatitudeDegrees = locationLatitudeDegrees;
    this.locationLongitudeDegrees = locationLongitudeDegrees;
    this.locationAltitudeMeters = locationAltitudeMeters;
  }
}
