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
    this.latitudeDegrees = latitudeDegrees;
    this.longitudeDegrees = longitudeDegrees;
    this.altitudeMeters = altitudeMeters;
    Object.freeze(this);
  }
}
