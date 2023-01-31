export class VehicleLocationProjection {
  public readonly latitudeDegrees: number;
  public readonly longitudeDegrees: number;
  public readonly altitudeMeters?: number;

  constructor(
    latitudeDegrees: number,
    longitudeDegrees: number,
    altitudeMeters?: number
  ) {
    this.latitudeDegrees = latitudeDegrees;
    this.longitudeDegrees = longitudeDegrees;
    this.altitudeMeters = altitudeMeters;
  }
}
