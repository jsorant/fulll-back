import { ValueObject } from "../../DddModel/ValueObject";

export class Location extends ValueObject {
  public readonly latitudeDegrees: number;
  public readonly longitudeDegrees: number;
  public readonly altitudeMeters?: number;

  constructor(
    latitudeDegrees: number,
    longitudeDegrees: number,
    altitudeMeters?: number
  ) {
    super();
    this.latitudeDegrees = Object.freeze(latitudeDegrees);
    this.longitudeDegrees = Object.freeze(longitudeDegrees);
    this.altitudeMeters = Object.freeze(altitudeMeters);
  }
}
